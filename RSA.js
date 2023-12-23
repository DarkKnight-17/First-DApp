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
function generateKeyPair(bits = 1024) {
    const p = generatePrime(bits);
    const q = generatePrime(bits);
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    const e = 65537;  // Общепринятое значение для e
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
    const signature = BigInt(hash(message)) ** BigInt(d) % BigInt(n);
    return signature;
}

// Проверка подписи сообщения с использованием открытого ключа RSA
function rsaVerify(message, signature, publicKey) {
    const { e, n } = publicKey;
    const hashedMessage = hash(message);
    const decryptedSignature = BigInt(signature) ** BigInt(e) % BigInt(n);
    return hashedMessage === decryptedSignature;
}

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

// Примечание: Функция hash должна быть заменена на безопасный алгоритм хеширования.
