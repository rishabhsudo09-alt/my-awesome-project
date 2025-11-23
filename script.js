
document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.current-input');
    const historyDisplay = document.querySelector('.history');
    let currentInput = '';
    let calculationHistory = [];
    let isRadians = true;

    document.querySelectorAll('.buttons button').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.dataset.value;

            if (value === '=') {
                try {
                    let expression = currentInput
                        .replace(/π/g, Math.PI)
                        .replace(/e/g, Math.E)
                        .replace(/√\(/g, 'Math.sqrt(')
                        .replace(/\^/g, '**')
                        .replace(/log\(/g, 'Math.log10(')
                        .replace(/sin\(/g, isRadians ? 'Math.sin(' : '(Math.sin((Math.PI/180)*')
                        .replace(/cos\(/g, isRadians ? 'Math.cos(' : '(Math.cos((Math.PI/180)*')
                        .replace(/tan\(/g, isRadians ? 'Math.tan(' : '(Math.tan((Math.PI/180)*')
                        .replace(/!/g, factorial);

                    const result = eval(expression);
                    calculationHistory.push(`${currentInput} = ${result}`);
                    historyDisplay.textContent = calculationHistory.slice(-3).join('\n');
                    currentInput = String(result);
                    display.textContent = currentInput;
                } catch (error) {
                    display.textContent = 'Error';
                    currentInput = '';
                }
            } else if (value === 'C') {
                currentInput = '';
                display.textContent = '0';
            } else if (value === 'DEL') {
                currentInput = currentInput.slice(0, -1);
                display.textContent = currentInput || '0';
            } else if (value === 'rad') {
                isRadians = !isRadians;
                button.textContent = isRadians ? 'Rad' : 'Deg';
            } else {
                currentInput += value;
                display.textContent = currentInput;
            }
        });
    });

    function factorial(n) {
        if (n === '') return '1';
        let num = parseInt(n);
        if (num < 0) return NaN;
        return num <= 1 ? 1 : num * factorial(num - 1);
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        const validKeys = /[0-9\.\+\-\*\/\(\)\^%!πe]|Backspace|Enter|Delete|Escape/;

        if (key.match(validKeys)) {
            e.preventDefault();
            if (key === 'Enter') handleButtonClick('=');
            else if (key === 'Backspace' || key === 'Delete') handleButtonClick('DEL');
            else if (key === 'Escape') handleButtonClick('C');
            else handleButtonClick(key);
        }
    });

    function handleButtonClick(value) {
        const button = [...document.querySelectorAll('button')].find(b => 
            b.dataset.value === value || 
            (value === '*' && b.dataset.value === '*') ||
            (value === 'Enter' && b.dataset.value === '=')
        );
        if (button) button.click();
    }
});
