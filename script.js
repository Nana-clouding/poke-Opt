let availableWords = [];
const usedWords = [];

window.onload = function() {
    // poke.txtを読み込んでavailableWordsに格納
    fetch('poke.txt')
        .then(response => response.text())
        .then(data => {
            availableWords = data.split('\n').map(word => word.trim());
        })
        .catch(error => {
            console.error('Error loading poke.txt:', error);
        });
};

// HTMLの要素
const userInput = document.getElementById('userInput');
const historyDiv = document.getElementById('history');

// 送信ボタンのクリックイベント
document.getElementById('submitBtn').addEventListener('click', function() {
    const userWord = userInput.value.trim();
    const lastChar = usedWords.length > 0 ? getLastChar(usedWords[usedWords.length - 1]) : null;

    if (usedWords.includes(userWord)) {
        alert('この単語は既に使われています！');
        return;
    }

    if (lastChar && userWord[0] !== lastChar) {
        alert('前の単語と一致しません！');
        return;
    }

    if (!availableWords.includes(userWord)) {
        alert('無効な単語です。');
        return;
    }

    addWordToHistory(userWord, 'user');
    usedWords.push(userWord);
    availableWords = availableWords.filter(word => word !== userWord);

    // 1秒の遅延を追加
    setTimeout(() => {
        const botWord = getBotResponse(userWord);
        if (botWord) {
            addWordToHistory(botWord, 'bot');
            usedWords.push(botWord);
            availableWords = availableWords.filter(word => word !== botWord);
        } else {
            alert('Botが応答できませんでした。');
        }
    }, 1000); // 1秒遅延

    userInput.value = '';
});

// ボットの応答を取得
function getBotResponse(userWord) {
    const lastChar = getLastChar(userWord);
    return availableWords.find(word => word[0] === lastChar && !usedWords.includes(word)) || null;
}

// 単語の最後の文字を取得（「ー」の場合は前の文字）
function getLastChar(word) {
    const lastChar = word.slice(-1);
    return lastChar === 'ー' ? word.slice(-2, -1) : lastChar;
}

// しりとり履歴に単語を追加
function addWordToHistory(word, sender) {
    const wordElement = document.createElement('div');
    wordElement.textContent = word;
    wordElement.className = sender;
    historyDiv.appendChild(wordElement);
}
