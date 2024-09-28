const ftp = require('ftp-client')


const connectToFTP = ()=>{
    const Client = new ftp({host: ip_address,port: 21,user: username, password: password},{logging: 'basic'})//assumes port is 21
    Client.ftp.connect()
    
}