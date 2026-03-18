const bcrypt = require('bcryptjs');

const password = 'Jeft2006';
const hash = '$2b$10$T6.r06QhwA7YwgUyROP0VueGu7PyGTEXYh0OQyNCu6iyG9S5n0wC6';

bcrypt.compare(password, hash).then(result => {
    console.log('Match:', result);
    if (result) {
        console.log('✅ Hash correct ! Utilise ce hash sur Render.');
    } else {
        console.log('❌ Hash incorrect. Génère un nouveau hash ci-dessous :');
        bcrypt.hash(password, 10).then(newHash => {
            console.log('Nouveau hash à copier sur Render :');
            console.log(newHash);
        });
    }
});