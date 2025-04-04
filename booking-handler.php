<?php
/**
 * Booking Handler - Gestionează rezervările pentru Boost Agency
 * 
 * Acest script gestionează:
 * - Încărcarea rezervărilor existente
 * - Verificarea disponibilității sloturilor
 * - Salvarea noilor rezervări
 */

// Configurare
$bookingsFile = 'bookings.json';
$logFile = 'booking-log.txt';

// Setări pentru prevenirea erorilor
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Funcție pentru logare
function logMessage($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message" . PHP_EOL, FILE_APPEND);
}

// Verifică ce tip de request este
$requestMethod = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Încarcă rezervările existente
function loadBookings() {
    global $bookingsFile;
    
    if (!file_exists($bookingsFile)) {
        file_put_contents($bookingsFile, json_encode(['bookings' => []]));
        return ['bookings' => []];
    }
    
    $content = file_get_contents($bookingsFile);
    return json_decode($content, true);
}

// Salvează rezervările în fișier
function saveBookings($bookingsData) {
    global $bookingsFile;
    return file_put_contents($bookingsFile, json_encode($bookingsData, JSON_PRETTY_PRINT));
}

// Verifică dacă o zi de săptămână este disponibilă (luni-vineri)
function isDayAvailable($date) {
    $dayOfWeek = date('N', strtotime($date)); // 1 (luni) până la 7 (duminică)
    $today = date('Y-m-d');
    
    // Verifică dacă data este în viitor (sau azi) și este zi lucrătoare (1-5 = Luni-Vineri)
    return $date >= $today && $dayOfWeek >= 1 && $dayOfWeek <= 5;
}

// Verifică dacă un slot de timp este disponibil
function isTimeSlotAvailable($date, $time, $bookings) {
    foreach ($bookings as $booking) {
        if ($booking['date'] === $date && $booking['time'] === $time) {
            return false;
        }
    }
    return true;
}

// Adaugă o nouă rezervare
function addBooking($date, $time, $clientData = []) {
    // Verifică formatul datei (YYYY-MM-DD)
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        return ['success' => false, 'message' => 'Invalid date format'];
    }
    
    // Verifică formatul timpului (HH:MM)
    if (!preg_match('/^\d{1,2}:\d{2}$/', $time)) {
        return ['success' => false, 'message' => 'Invalid time format'];
    }
    
    // Verifică disponibilitatea zilei
    if (!isDayAvailable($date)) {
        return ['success' => false, 'message' => 'The selected day is not available'];
    }
    
    // Validează datele clientului
    if (empty($clientData['name'])) {
        return ['success' => false, 'message' => 'Name is required'];
    }
    
    if (empty($clientData['email']) || !filter_var($clientData['email'], FILTER_VALIDATE_EMAIL)) {
        return ['success' => false, 'message' => 'Invalid email'];
    }
    
    if (empty($clientData['subject'])) {
        return ['success' => false, 'message' => 'Meeting subject is required'];
    }
    
    // Încarcă rezervările existente
    $bookingsData = loadBookings();
    $bookings = $bookingsData['bookings'];
    
    // Verifică disponibilitatea slotului de timp
    if (!isTimeSlotAvailable($date, $time, $bookings)) {
        return ['success' => false, 'message' => 'The selected time slot is no longer available'];
    }
    
    // Crează noua rezervare
    $newBooking = [
        'id' => uniqid(),
        'date' => $date,
        'time' => $time,
        'client' => [
            'name' => htmlspecialchars($clientData['name']),
            'email' => htmlspecialchars($clientData['email']),
            'subject' => htmlspecialchars($clientData['subject']),
            'notes' => isset($clientData['notes']) ? htmlspecialchars($clientData['notes']) : '',
            'guests' => isset($clientData['guests']) ? $clientData['guests'] : []
        ],
        'created_at' => date('Y-m-d H:i:s')
    ];
    
    // Adaugă rezervarea la lista existentă
    $bookings[] = $newBooking;
    $bookingsData['bookings'] = $bookings;
    
    // Salvează actualizarea
    if (saveBookings($bookingsData)) {
        logMessage("Booking added: {$date} {$time} for {$clientData['name']} ({$clientData['email']})");
        
        // Într-o aplicație reală, aici am trimite și un email de confirmare
        // sendConfirmationEmail($newBooking);
        
        return [
            'success' => true, 
            'message' => 'Booking confirmed', 
            'booking' => $newBooking
        ];
    } else {
        logMessage("Error saving booking: {$date} {$time}");
        return ['success' => false, 'message' => 'Error saving the booking'];
    }
}

// Funcție pentru trimiterea email-ului de confirmare (neimplementată)
function sendConfirmationEmail($booking) {
    // Aceasta este doar o funcție placeholder
    // Într-o implementare reală, am trimite un email folosind PHPMailer sau funcția mail()
    logMessage("Email de confirmare pregătit pentru trimitere către: {$booking['client']['email']}");
    return true;
}

// Obține sloturile disponibile pentru o dată
function getAvailableSlots($date) {
    // Verifică disponibilitatea zilei
    if (!isDayAvailable($date)) {
        return [];
    }
    
    // Încarcă rezervările existente
    $bookingsData = loadBookings();
    $bookings = $bookingsData['bookings'];
    
    $availableSlots = [];
    
    // Verifică dacă data este azi
    $isToday = date('Y-m-d') === $date;
    $currentHour = (int)date('G'); // ora în format 24h fără leading zero
    $currentMinute = (int)date('i');
    
    // Generează sloturi de 30 de minute între 18:00 și 20:00
    for ($hour = 18; $hour < 20; $hour++) {
        for ($minute = 0; $minute < 60; $minute += 30) {
            // Verificăm dacă timpul a trecut deja pentru ziua curentă
            if ($isToday && ($hour < $currentHour || ($hour === $currentHour && $minute <= $currentMinute))) {
                // Slot de timp din trecut pentru ziua curentă, nu-l includem
                continue;
            }
            
            $timeStr = sprintf("%d:%02d", $hour, $minute);
            
            if (isTimeSlotAvailable($date, $timeStr, $bookings)) {
                $availableSlots[] = $timeStr;
            }
        }
    }
    
    return $availableSlots;
}

// Gestionează acțiunile requestului
try {
    switch ($requestMethod) {
        case 'GET':
            // Gestionare request GET
            if ($action === 'available-slots' && isset($_GET['date'])) {
                $date = $_GET['date'];
                $availableSlots = getAvailableSlots($date);
                echo json_encode(['success' => true, 'slots' => $availableSlots]);
            } elseif ($action === 'bookings') {
                // Returnează toate rezervările (doar pentru scop de demonstrație)
                // Într-un mediu real, am restricționa mai mult accesul
                $bookingsData = loadBookings();
                echo json_encode(['success' => true, 'data' => $bookingsData]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid action']);
            }
            break;
            
        case 'POST':
            // Gestionare request POST
            if ($action === 'book') {
                // Verifică datele primite
                $data = json_decode(file_get_contents('php://input'), true);
                
                if (!isset($data['date']) || !isset($data['time'])) {
                    echo json_encode(['success' => false, 'message' => 'Missing data']);
                    break;
                }
                
                $clientData = isset($data['client']) ? $data['client'] : [];
                
                // Verifică dacă avem toate datele necesare
                if (empty($clientData['name']) || empty($clientData['email']) || empty($clientData['subject'])) {
                    echo json_encode(['success' => false, 'message' => 'Incomplete client information']);
                    break;
                }
                
                $result = addBooking($data['date'], $data['time'], $clientData);
                echo json_encode($result);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid action']);
            }
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Unsupported request method']);
    }
} catch (Exception $e) {
    logMessage("Error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An unexpected error occurred']);
} 