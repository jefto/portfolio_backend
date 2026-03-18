const bcrypt = require('bcryptjs');

const password = '';

// Générer un nouveau hash
bcrypt.hash(password, 10).then(hash => {
    console.log('Nouveau hash:', hash);

    // Vérifier immédiatement
    return bcrypt.compare(password, hash).then(result => {
        console.log('Match:', result);
        console.log('');
        console.log('Copie cette valeur dans ADMIN_PASSWORD_HASH sur Render:');
        console.log(hash);
    });
});