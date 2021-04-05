# REQUIRED: npm install rpi-led-control
# Wifi config can be found in /etc/wpa_supplicant/wpa_supplicant.conf

# First Install
cd ~
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install node
npm install rpi-led-control
wget https://github.com/TM0D/ScoreSaberClock/releases/latest/download/ssclock.zip
unzip ssclock.zip
rm ssclock.zip
sudo echo "./~/ssclock/scripts/run.sh &" > /etc/rc.local ## haha overwritng system files
sudo echo "exit 0" >> /etc/rc.local
