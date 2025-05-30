const bcrypt = require('bcrypt');

async function generateHashedPasswords() {
    const passwords = {
        admin: 'admin123',
        joao: 'joao123',
        maria: 'maria123',
        pedro: 'pedro123'
    };

    for (const [user, password] of Object.entries(passwords)) {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(`${user}: ${hashedPassword}`);
    }
}

generateHashedPasswords(); 