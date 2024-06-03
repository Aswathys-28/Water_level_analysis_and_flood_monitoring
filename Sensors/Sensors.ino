#include <Arduino.h>
#if defined(ESP32)
  #include <WiFi.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#endif
#include <Firebase_ESP_Client.h>
#include <SoftwareSerial.h>
SoftwareSerial SIM900A(5,4); // RX, TX
//Provide the token generation process info.
#include "addons/TokenHelper.h"
//Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"


#define WIFI_SSID "Test"
#define WIFI_PASSWORD "project123"

int val = 0 ;
// api key
#define API_KEY "AIzaSyDjspDMaDIGzth_cMaPTpiV_MvWWK8Zl3g"

// Insert RTDB URL
#define DATABASE_URL "https://ledtest-334bf.firebaseio.com/" 


const int ledPin = D1;   // the LED pin
const int relayPin = D2; // the relay pin
int pulseValue;           // the pulse sensor value
int bpm; 

FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

bool signupOK = false;

unsigned long sendDataPrevMillis = 0;
#include "DHT.h"        // including the library of DHT11 temperature and humidity sensor
#define DHTTYPE DHT11   // DHT 11
#define dht_dpin 0 //D3 pin of nodemcu


DHT dht(dht_dpin, DHTTYPE);



void setup(void)
{ 
  dht.begin();
  Serial.begin(115200);
   SIM900A.begin(9600);
     delay(1000);
       while(SIM900A.available()) {
    Serial.write(SIM900A.read());
  }

  // Send AT command to set SMS mode
  SIM900A.println("AT+CMGF=1");
  delay(1000);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
   Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();
    config.api_key = API_KEY;
  pinMode(ledPin, OUTPUT);
  pinMode(relayPin, OUTPUT);
  digitalWrite(ledPin, LOW);
  digitalWrite(relayPin, LOW); // Initially turn off the relay
  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;
  Serial.println("Humidity and temperature\n\n");
  delay(700);
  if (Firebase.signUp(&config, &auth, "anazksunil5@gmail.com", "Sindhumnjw@813kps")){
        Serial.println("Authentication successful");
    signupOK = true;

  }
  else {
  Serial.printf("Authentication failed. Error: %s\n", config.signer.signupError.message.c_str());
}

   config.token_status_callback = tokenStatusCallback; //see addons/TokenHelper.h
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

}
void loop() {

  sendSMS("+918075119654", "Hello, World!");
  delay(5000);
    float h = dht.readHumidity();
    float t = dht.readTemperature();  
   
    int s1=analogRead(A0);
    Serial.println(s1); 

    Serial.print("Current humidity = ");
    Serial.print(h);
    Serial.print("-------- ");


    Serial.print("%  ");
    Serial.print("temperature = ");
    Serial.print(t); 
    Serial.println("C  ");

   if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 5000 || sendDataPrevMillis == 0)){
    sendDataPrevMillis = millis();

    // Add a sample value to the database path "test/sample"
    float sampleValue = 4244.42;
   
    if (Firebase.RTDB.setFloat(&fbdo, "test/NewTemp", t)&&Firebase.RTDB.setFloat(&fbdo, "test/Humidity", h)&&Firebase.RTDB.setFloat(&fbdo, "test/water", s1)){
      Serial.println("Value added to Firebase: " + String(sampleValue));
    }
    else {
      Serial.println("Failed to add value. Reason: " + fbdo.errorReason());
    }
  }
  delay(800);
}


void sendSMS(String number, String message) {
  // AT command to set recipient phone number
  SIM900A.print("AT+CMGS=\"");
  SIM900A.print(number);
  SIM900A.println("\"");
  delay(1000);
  
  // Print the message to be sent
  SIM900A.print(message);
  
  // Send Ctrl+Z (ASCII code 26) to indicate the end of the message
  SIM900A.write(26);
  delay(1000);
}