// конфигурация чат-бота
const configChatbot = {};
// ключ для хранения отпечатка браузера
configChatbot.key = 'fingerprint';
// реплики чат-бота
configChatbot.replicas = 'data/data-1.json';
// корневой элемент
configChatbot.root = SimpleChatbot.createTemplate();
// переменная для хранения экземпляра
let chatbot = null;
// добавление ключа для хранения отпечатка браузера в LocalStorage
let fingerprint = localStorage.getItem(configChatbot.key);
if (!fingerprint) {
  Fingerprint2.get(function (components) {
    fingerprint = Fingerprint2.x64hash128(components.map(function (pair) {
      return pair.value
    }).join(), 31)
    localStorage.setItem(configChatbot.key, fingerprint)
  });
}
// получение json-файла, содержащего сценарий диалога для чат-бота через AJAX
const request = new XMLHttpRequest();
request.open('GET', configChatbot.replicas, true);
request.responseType = 'json';
request.onload = function () {
  const status = request.status;
  if (status === 200) {
    const data = request.response;
    if (typeof data === 'string') {
      configChatbot.replicas = JSON.parse(data);
    } else {
      configChatbot.replicas = data;
    }
    // инициализация SimpleChatbot
    chatbot = new SimpleChatbot(configChatbot);
    chatbot.init();
  } else {
    console.log(status, request.response);
  }
};
request.send();