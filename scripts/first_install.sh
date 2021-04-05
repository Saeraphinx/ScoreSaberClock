# REQUIRED: npm install rpi-led-control
# Wifi config can be found in /etc/wpa_supplicant/wpa_supplicant.conf

# First Install
cd ~
mkdir /LED
cd ~/LED
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install node
npm install rpi-led-control
wget https://github.com/TM0D/ScoreSaberClock/releases/latest/download/release.zip
unzip release.zip
rm release.zip
