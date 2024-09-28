let availableWords = [];
const usedWords = [];

// 小文字や「ー」を正規化するためのマップ
const smallToLargeMap = {
    'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お',
    'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ', 'っ': 'つ', 'ー': '',
    'ァ': 'ア', 'ィ': 'イ', 'ゥ': 'ウ', 'ェ': 'エ', 'ォ': 'オ',
    'ャ': 'ヤ', 'ュ': 'ユ', 'ョ': 'ヨ', 'ッ': 'ツ'
};

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
    handleUserInput(userInput.value.trim());
});

// ユーザーの入力を処理
function handleUserInput(userWord) {
    userWord = normalizeWord(userWord);  // 小文字や「ー」の正規化
    const lastChar = usedWords.length > 0 ? getLastChar(usedWords[usedWords.length - 1]) : null;

    // 同じ単語を使わない
    if (usedWords.includes(userWord)) {
        alert('この単語は既に使われています！');
        return;
    }

    // 前の単語の最後の文字に一致しているか確認
    if (lastChar && userWord[0] !== lastChar) {
        alert('前の単語と一致しません！');
        return;
    }

    // 有効な単語かどうか確認
    if (!availableWords.includes(userWord)) {
        alert('無効な単語です。');
        return;
    }

    // 末尾が「ん」の単語は負け
    if (userWord.slice(-1) === 'ん') {
        alert('「ん」で終わる単語は使えません！');
        return;
    }

    addWordToHistory(userWord, 'user');
    usedWords.push(userWord);
    availableWords = availableWords.filter(word => word !== userWord);

    // 1秒の遅延を追加してボットが応答
    setTimeout(() => {
        const botWord = getBotResponse(userWord);
        if (botWord) {
            addWordToHistory(botWord, 'bot');
            usedWords.push(botWord);
            availableWords = availableWords.filter(word => word !== botWord);
        } else {
            alert('ボットが応答できませんでした。');
        }
    }, 1000);

    userInput.value = '';
}

// ボットの応答を取得 (「ん」で終わる単語を除外)
function getBotResponse(userWord) {
    const lastChar = getLastChar(userWord);
    const candidates = availableWords.filter(word => word[0] === lastChar && !usedWords.includes(word) && word.slice(-1) !== 'ん');
    if (candidates.length > 0) {
        return candidates[Math.floor(Math.random() * candidates.length)];
    }
    return null;
}

// 単語の最後の文字を取得（「ー」の場合は前の文字）
function getLastChar(word) {
    const lastChar = word.slice(-1);
    return smallToLargeMap[lastChar] || (lastChar === 'ー' ? word.slice(-2, -1) : lastChar);
}

// 小文字や「ー」を大文字に正規化
function normalizeWord(word) {
    return word.split('').map(char => smallToLargeMap[char] || char).join('');
}

// しりとり履歴に単語を追加
function addWordToHistory(word, sender) {
    const wordElement = document.createElement('div');
    wordElement.textContent = word;
    wordElement.className = sender;
    historyDiv.appendChild(wordElement);
}
