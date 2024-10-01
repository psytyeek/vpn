const { Server } = require('ssh2');
require('dotenv').config();

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAuj9hd+MxFOW9QAcyezi+Il/8C7SIg7CI9nwDmYWSV1xOKKoa
gO4m1jNfyvJ6ICw5o4DJ3fBGaxE45WqsDY8zjpSZC2+d10JtnAwEikhTfyyEZGgX
0bqJ3hmkzCxXAqm5jkkMZF8Bh+YGHUe8bJP8U2QVnYUMJutZ8zEGQpb7KS6kMsOr
v/RijsQPExxDnXqPJJeDud/i/afhRsysDkDcOg9f1nCsjk3whvXBA6Vgm+bQ2/h9
JMBcOtGpwOvTCb5fGi1o0QRm1R21B24rvGtJxu+vwXV2hgd9FETQYA7++dfg2qr1
/HLXrRWEVjZhtcxHABVqKgnmmxifzbETQguM6wIDAQABAoIBAAHor0B9UaKbxMWo
qKeDPIQ5remozOVlyPPgFGFdlffTQYQcCjjuXIXTzPj6G9N6Tkc3l5Dwxl7Z/XsD
VuHSaRCVVeQ8ZqIKd/kiVUGUcDITfnIscBjrEEBmOlDA1wSbrwQM5VWemWEhxiNp
i/UkXgMigp40sgnC8Fg4544XvX4iQuE9P6RxfrwDk4avU49nQ4GwBZ8diIGCB0MG
gLPCMxsmBW+oiwRr8jZfnq1QO7rmdl7/9FXBFzwfhm9rFAOi/PyNATxd0UWXB+14
Trui1v+lkEBsnevXM2X0ABZXBpYT94ERHPJxeJxQcexhrN+qZKs4ErZ+wd1dCLWd
IcoYBeECgYEAwM6VPmp0zcWGqT2ve5aa8Vz1/nZugmxiUNPl3uQq1Kou1z5O3lKR
B2lPo8vUSGGKidDs/ytxi3i2UDgV/qOgTeSEG3GNemBy1a8SdGxknCf/HnGq4vxC
Tu7y5dBKLrwbZTAh/snp6KkbdlgjuSmGllGVI/715Vtbfo76O423r0MCgYEA90pv
NQvkEr2wIAtvoMQi/76p81pqAhcAq5iqzE11Tic9aVspY18WLSi18DewB64lWRsl
Oc+aqVAi3j0D/1sQb68TqPiZCP4wVmN7+qDEcvYp/cVHcz3F5+haZO7XTGP2rjuP
DuL+rW/PmyAXMF3yXvG64f2nvXk3fojR22ACbTkCgYBOzyIp1RHRWj/kxZYJClJi
/gB+9qHNJcg6CaMYLGNlcfqbeJh8P3uQb/dhmFs5CsW593AoDPXocHr05zf2UaOg
sxtcrFmMAAhwV5NPi07ElYSuSP/0r+/am8klLrJjz/fSsI30u0ulEhprkTNo6BRf
NRGlGP4hten8HS0jUpYWSQKBgQDxJdf+bcMSd4IaLazEpJ/Qr3iBxEieExpnO7BL
HLno5aEgbXKV4fL5RLrvLw7s3mizVSJfFtEmjOwDtpKAYKhNkPhmDU8HEwHGLKuJ
A1+vD9hxDQGZIsMsXExSIws3BkBXNeNSzA84yFE2X/vdAbBJ4AazPK1nup5gOUIU
YLLdGQKBgC8+YqXkASM8uurOTZ7FpuHSNmsSR7mdz0a4XjYfDfJw9UGkJuDsvnEz
vwA6S6iNxQrgm9ak83QswIyRYcdbQjW3TP90Paiq+cEgiyim4oH1cFwjKjAE4rRd
GKLgBaziaa+pVwo97Aftz0C/QbAZ4NNFDR4SPwSaavasfOQtfH+K
-----END RSA PRIVATE KEY-----
`;

const server = new Server({
    hostKeys: [privateKey]
  }, (client) => {
    console.log('Client connected!');
  
    client.on('authentication', (ctx) => {
      if (ctx.method === 'password' && ctx.username === 'shahid' && ctx.password === 'shahid') {
        ctx.accept();
      } else {
        ctx.reject();
      }
    }).on('ready', () => {
      console.log('Client authenticated!');
  
      client.on('session', (accept, reject) => {
        const session = accept();
  
        session.on('shell', (accept, reject) => {
          const stream = accept();
          stream.write('Welcome to the SSH server!\n');
          stream.write('Type "exit" to close the connection.\n');
  
          stream.on('data', (data) => {
            // You can process shell commands here
            if (data.toString().trim() === 'exit') {
              stream.write('Goodbye!\n');
              stream.exit(0); // Exit the shell
              stream.end();
            } else {
              stream.write(`You typed: ${data}`);
            }
          });
        }).on('exec', (accept, reject, info) => {
          console.log(`Client wants to execute: ${info.command}`);
  
          const stream = accept();
          stream.stderr.write('This is stderr\n');
          stream.write('This is stdout\n');
          stream.exit(0);
          stream.end();
        });
      });
    });
  });
  
  const PORT = process.env.PORT || 7866;
  server.listen(PORT, '0.0.0.0', () => {
    console.log('Listening on port:',PORT);
  });