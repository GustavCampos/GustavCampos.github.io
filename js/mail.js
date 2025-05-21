document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const myEmail = 'gustavop.campos2004@gmail.com';

    const text = {
        'pt-br': {
            'n-message': 'Nova mensagem de ',
            'from': 'De ',
            'by': ' por ',
        },
        'en': {
            'n-message': 'New message from ',
            'from': 'From ',
            'by': ' by ',
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const cl = document.querySelector('.lang-button.is-selected').value;

        const data = new FormData(form);

        const subject = encodeURIComponent(text[cl]['n-message'] + data.get('name'));
        const message = encodeURIComponent(
            data.get('message') + '\n\n' + 
            text[cl]['from'] + data.get('name') + 
            text[cl]['by'] + data.get('email') + '.'
        );

        window.open(
            `mailto:${myEmail}?subject=${subject}&body=${message}`,
            '_blank'
        );
    });
});