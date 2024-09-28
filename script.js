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
const resultDiv = document.getElementById('result');

// 送信ボタンのクリックイベント
document.getElementById('submitBtn').addEventListener('click', function() {
    handleUserInput(userInput.value.trim());
});

// ヒントボタンのクリックイベント
document.getElementById('hintBtn').addEventListener('click', function() {
    const userWord = usedWords.length > 0 ? usedWords[usedWords.length - 1] : null;
    const hint = getHint(userWord);
    if (hint) {
        alert('ヒント: ' + hint);
    } else {
        alert('ヒントがありません');
    }
});

// 自動回答ボタンのクリックイベント
document.getElementById('autoPlayBtn').addEventListener('click', function() {
    autoPlay();
});

// ユーザーの入力を処理
function handleUserInput(userWord) {
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

    // 1秒の遅延を追加してボットがランダムに応答
    setTimeout(() => {
        const botWord = getBotResponse(userWord);
        if (botWord) {
            addWordToHistory(botWord, 'bot');
            usedWords.push(botWord);
            availableWords = availableWords.filter(word => word !== botWord);
        } else {
            alert('ボットが応答できませんでした。');
            displayResult('あなたの勝ちです！');
        }
    }, 1000);

    userInput.value = '';
}

// ボットの応答を取得 (ランダムに選択)
function getBotResponse(userWord) {
    const lastChar = getLastChar(userWord);
    const candidates = availableWords.filter(word => word[0] === lastChar && !usedWords.includes(word));
    if (candidates.length > 0) {
        return candidates[Math.floor(Math.random() * candidates.length)];
    }
    return null;
}

// ヒント機能
function getHint(userWord) {
    const lastChar = getLastChar(userWord);
    const candidates = availableWords.filter(word => word[0] === lastChar && !usedWords.includes(word));
    return candidates.length > 0 ? candidates[0] : null;
}

// 自動プレイ (ボタンを押すと連続で入力が進む)
function autoPlay() {
    const userWord = usedWords.length > 0 ? usedWords[usedWords.length - 1] : null;
    const botWord = getBotResponse(userWord);

    if (botWord) {
        addWordToHistory(botWord, 'bot');
        usedWords.push(botWord);
        availableWords = availableWords.filter(word => word !== botWord);
    } else {
        alert('ボットが応答できませんでした。');
        displayResult('あなたの勝ちです！');
    }
}

// 結果表示
function displayResult(message) {
    resultDiv.textContent = message;
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
