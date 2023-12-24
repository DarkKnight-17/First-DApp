

const crypto = require('crypto')



let blockIndex = 0;
class Block{
    constructor( timestamp, data,previousHash, sender, receiver){
        this.blockIndex = blockIndex,
        this.timestamp = timestamp,
        this.previousHash = previousHash,
        this.receiver = receiver,
        this.sender = sender,
        this.data = data,
        this.hash = this.getHash()
        blockIndex++;
    }

    getHash(){
        return hashCode(this.data + this.timestamp + this.previousHash + this.data);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()]
    }
    createGenesisBlock(){
        return new Block( Date.toLocaleString(), "this is the first block", "0", "NoOne", "NoOne");
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
   addBlock(newBlock){
       
       newBlock.hash = newBlock.getHash()
       this.chain.push(newBlock);
    }
    isChainValid(){
        for(let  i = 1; i< this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if(currrentBlock.hash !== currentBlock.getHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
            return true;
        }
    }
    
}

    

const blockChain = new Blockchain();

class Person{
    constructor(name, twoKeys){
        this.name = name;
        const [privKey,pubKey ] = twoKeys;
        this.privKey = privKey;
        this.pubKey = pubKey;
        this.inbox = [];
        
    }

    sendMessage(message, person){
         let encoded = rsaEncrypt(message, person.pubKey);
         
         let signatureOfSender = rsaSign(message, this.privKey);
         let isValid = rsaVerify(message, signatureOfSender, this.pubKey);
         if(isValid){
             console.log("Your email has been delivered!")
             decodedText = rsaDecrypt(encoded, person.privKey)
             person.inbox.push(decodedText);
             
            let date = new Date();
            const verifiedBlock = new Block(date.toLocaleString(), decodedText, blockChain.getLatestBlock().hash, this.name, person.name);
            blockChain.addBlock(verifiedBlock);
         }else{
              console.log("The message was not send");        
         }

        }
        
        

    }

    

const p1 = new Person("Alan", generateKeyPair());
const p2 = new Person("Mike", generateKeyPair());
const p3 = new Person("Alice", generateKeyPair());
const p4 = new Person("Jhon", generateKeyPair());

const users = {
    "Alan": p1,
    "Mike": p2,
    "Alice": p3,
    "Jhon": p4,
}





let isLaunched = true;

while(isLaunched){
    console.log("Welcome to our Blockchain app!");
    console.log("Here, you can send emails between a group of people");
    console.log("This is the list of our current users");
    for (let user in users){
        console.log(`${user}}`);
    }

    let currentUser = prompt("Enter who you are:  ")
    alert(`Welcome back ${currentUser}!`);
    
    let receiver = prompt("Enter who you want to have a chat with:  ");
    const email = prompt("What is your message: ");
    
    
    users[currentUser].sendmessage(email, users[receiver]);
    
    for(let block of blockChain.chain){
        console.log(block);
    }
   let response = prompt("Would you like to continue?(yes/no): ");
   if(response === "no"){
    console.log("Okay, goodbuy!")
    isLaunched = false;
   }
       

}
    
// Функция для проверки, является ли число простым
function isPrime(num) {
    if (num <= 1) {
        return false;
    }
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
}

// Функция для вычисления наибольшего общего делителя
function gcd(a, b) {
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

// Функция для вычисления модульного обратного значения
function modinv(a, m) {
    let [m0, x0, x1] = [m, 0, 1];
    while (a > 1) {
        const q = Math.floor(a / m);
        [m, a] = [a % m, m];
        [x0, x1] = [x1 - q * x0, x0];
    }
    return x1 + m0 * (x1 < 0 ? 1 : 0);
}

// Функция для генерации пары ключей RSA
function generateKeyPair(bits = 8) {
    const p = generatePrime(bits);
    const q = generatePrime(bits);
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    let e = 3; // Общепринятое значение для e
    for(let i = 3; ; i += 2) {
        if(isPrime(i) && phi % i != 0 && gcd(i, phi) === 1) {
            e = i;
            break;
        }
    }
    const d = modinv(e, phi);
    return [{ e, n }, { d, n }];
}

// Функция для генерации простого числа заданной битовой длины
function generatePrime(bits) {
    while (true) {
        const num = getRandomBits(bits);
        if (isPrime(num)) {
            return num;
        }
    }
}

// Генерация случайных битов
function getRandomBits(bits) {
    return Math.floor(Math.random() * (2 ** bits));
}

// Шифрование сообщения с использованием открытого ключа RSA
function rsaEncrypt(message, publicKey) {
    const { e, n } = publicKey;
    const cipherText = message.split('').map(char => BigInt(char.charCodeAt(0)) ** BigInt(e) % BigInt(n));
    return cipherText;
}

// Расшифровка сообщения с использованием закрытого ключа RSA
function rsaDecrypt(cipherText, privateKey) {
    const { d, n } = privateKey;
    const decryptedText = cipherText.map(char => String.fromCharCode(Number(BigInt(char) ** BigInt(d) % BigInt(n))));
    return decryptedText.join('');
}

// Подписание сообщения с использованием закрытого ключа RSA
function rsaSign(message, privateKey) {
    const { d, n } = privateKey;
    const signature = BigInt(hashCode(message)) ** BigInt(d) % BigInt(n);
    return signature;
}

// Проверка подписи сообщения с использованием открытого ключа RSA
function rsaVerify(message, signature, publicKey) {
    const { e, n } = publicKey;
    const hashedMessage = hashCode(message);
    const decryptedSignature = BigInt(signature) ** BigInt(e) % BigInt(n);
    return hashedMessage.toString() === decryptedSignature.toString();
}
/* 
// Пример использования
const [publicKey, privateKey] = generateKeyPair();
const message = "Привет, RSA!";
console.log("Исходное сообщение:", message);

// Шифрование
const cipherText = rsaEncrypt(message, publicKey);
console.log("Зашифрованное сообщение:", cipherText);

// Расшифровка
const decryptedText = rsaDecrypt(cipherText, privateKey);
console.log("Расшифрованное сообщение:", decryptedText);

// Подписание
const signature = rsaSign(message, privateKey);
console.log("Цифровая подпись:", signature);

// Проверка подписи
const isVerified = rsaVerify(message, signature, publicKey);
console.log("Подпись проверена:", isVerified); 

*/

// Примечание: Функция hash должна быть заменена на безопасный алгоритм хеширования.


function hashCode(input) {
    // Create a hash object
    const hash = crypto.createHash('sha256');
 
    // Pass the input data to the hash object
    hash.update(input);
 
    // Get the output in hexadecimal format
    return hash.digest('hex');
}


