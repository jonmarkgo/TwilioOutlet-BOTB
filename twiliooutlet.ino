#include <SPI.h>
#include <WiFly.h>

char* ssid = "my$ssid$lol"; //enter your SSID here, replace all spaces with $ (ex. "my ssid lol" = "my$ssid$lol")
char* pass = "the$password"; //enter your wifi passphrase here

char* serverAddress = "skynet.com"; //enter the IP of your node.js server
int serverPort = 1337; //enter the port your node.js server is running on, by default it is 1337

const int powerPin = 12; //pin ocnnected to powerswitch

WiFlyClient client;

void setup() {
  pinMode(powerPin, OUTPUT);   
  digitalWrite(powerPin, LOW);
  Serial.begin(9600);
  WiFly.setUart(&Serial);
  WiFly.begin();
  WiFly.join(ssid, pass);
  client.connect(serverAddress, serverPort);
  client.println("hello world");
}

void loop()
{
  //check for incoming data over TCP
  if (client.available()) {
    char c = client.read();
   
    //command handler (for dialpad digits)
    if (c == '1') {
      digitalWrite(powerPin, HIGH);
      client.println("on");
    } 
    else {
      digitalWrite(powerPin, LOW);
      client.println("off");
    }
  }
}
