#@IgnoreInspection BashAddShebang
# Vagrantfile setup script
clear
echo "--- Setting up Enjoy API Virtual Machine ---"
IP=192.168.100.200
APPENV=local
DBHOST=localhost
DBNAME=GamikazeTV
DBUSER=root
DBPASS=root
FACEBOOK_APP_ID=833144813425784
FACEBOOK_APP_SECRET=fa2d9337b349bc54cb1ef6713b03b32d
TWITTER_APP_ID=IcnPzsr2jRNYg2eIUdUl4r4Jm
TWITTER_APP_SECRET=IcnPzsr2jRNYg2eIUdUl4r4Jm
echo "--- Updating packages list ---"
apt-get update
echo "--- Installing base packages : "
echo "--- git grc colortail multitail curl php5 apache2 libapache2-mod-php5 php5-curl php5-gd php5-mcrypt php5-mysql php-apc sqlite php5-sqlite"
echo "--- It might take a while. ---"
apt-get -y install git grc colortail multitail curl php5 apache2 libapache2-mod-php5 php5-curl php5-gd php5-mcrypt php5-mysql php-apc sqlite php5-sqlite
echo "--- Updating packages list again, for fun ---"
apt-get update
echo "--- Install MySQL specific packages and settings ---"
echo "mysql-server mysql-server/root_password password $DBPASS" | debconf-set-selections
echo "mysql-server mysql-server/root_password_again password $DBPASS" | debconf-set-selections
echo "phpmyadmin phpmyadmin/dbconfig-install boolean true" | debconf-set-selections
echo "phpmyadmin phpmyadmin/app-password-confirm password $DBPASS" | debconf-set-selections
echo "phpmyadmin phpmyadmin/mysql/admin-pass password $DBPASS" | debconf-set-selections
echo "phpmyadmin phpmyadmin/mysql/app-pass password $DBPASS" | debconf-set-selections
echo "phpmyadmin phpmyadmin/reconfigure-webserver multiselect none" | debconf-set-selections
apt-get -y install mysql-server-5.5 phpmyadmin
echo "--- Add environment variables to Apache ---"
cat > /etc/apache2/httpd.conf <<EOF
<VirtualHost *:80>
	DocumentRoot /var/www
	DirectoryIndex index.php
	<Directory /var/www >
		Options Indexes FollowSymLinks MultiViews
		AllowOverride All
		Order allow,deny
		allow from all
	</Directory>
    CustomLog "|/usr/bin/logger -t 'apache'" combined
    ErrorLog syslog
    SetEnv GamikazeTV_IP $IP
    SetEnv GamikazeTV_APP_ENV $APPENV
    SetEnv GamikazeTV_DB_HOST $DBHOST
    SetEnv GamikazeTV_DB_NAME $DBNAME
    SetEnv GamikazeTV_DB_USER $DBUSER
    SetEnv GamikazeTV_DB_PASS $DBPASS
    SetEnv GamikazeTV_TW_APP_ID $TWITTER_APP_ID
	SetEnv GamikazeTV_FB_APP_ID $FACEBOOK_APP_ID
	SetEnv GamikazeTV_TW_APP_SECRET $TWITTER_APP_SECRET
	SetEnv GamikazeTV_FB_APP_SECRET $FACEBOOK_APP_SECRET
</VirtualHost>
EOF
echo "--- Updating PHP to 5.4+ ---"
sudo apt-get -y install python-software-properties
sudo add-apt-repository ppa:ondrej/php5-oldstable
sudo apt-get -qq update
sudo apt-get -y install php5
echo "--- Enabling modrewrite and setting up apache redirect ---"
sudo a2enmod rewrite
echo "--- Creating a symlink for phpmyadmin and future phpunit use ---"
ln -fs /vagrant/vendor/bin/phpunit /usr/local/bin/phpunit
ln -fs /usr/share/phpmyadmin /var/www/phpmyadmin
echo "--- Installing XDebug - SKIPPED FOR PERFORMANCE REASON"
sudo mkdir /var/log/xdebug
sudo chown www-data:www-data /var/log/xdebug
sudo apt-get -y install php5-xdebug
sudo php5enmod xdebug
cat > /etc/php5/cli/conf.d/20-xdebug.ini<<EOF
zend_extension="/usr/lib/php5/20100525+lfs/xdebug.so"
xdebug.remote_enable = 1
xdebug.idekey = "GamikazeTVXDEBUG"
xdebug.remote_autostart = 1
xdebug.remote_connect_back = 1
xdebug.remote_port = 8999
xdebug.remote_handler=dbgp
EOF
echo "--- Enabling headers ---"
sudo a2enmod headers
echo "--- Enabling ssl ---"
#full process here: https://www.digitalocean.com/community/tutorials/how-to-create-a-ssl-certificate-on-apache-for-ubuntu-12-04
#sudo a2enmod ssl
#sudo mkdir /etc/apache2/ssl
#sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/apache2/ssl/apache.key -out /etc/apache2/ssl/apache.crt
#Country Name (2 letter code) [AU]:FR
#State or Province Name (full name) [Some-State]:Alsace
#Locality Name (eg, city) []:Thann
#Organization Name (eg, company) [Internet Widgits Pty Ltd]:Enjoy Corporation
#Organizational Unit Name (eg, section) []:Enjoy Corporation
#Common Name (e.g. server FQDN or YOUR name) []:192.168.100.100
#Email Address []:stephane.schittly@enjoycorporation.org
#sudo vi /etc/apache2/sites-available/default-ssl
# Add ServerName example.com:443 after ServerAdmin [email]
# check those lines:
#SSLEngine on
#SSLCertificateFile /etc/apache2/ssl/apache.crt
#SSLCertificateKeyFile /etc/apache2/ssl/apache.key
#sudo a2ensite default-ssl
echo "--- Restarting Apache ---"
service apache2 restart
echo "--- Install finished ! GamikazeTV is accessible at http://$IP and phpmyadmin at http://$IP/phpmyadmin"