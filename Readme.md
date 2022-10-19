# Зачем?

Скрипт работает как API для базы b1 в СУБД MySQL
Ходит в таблицу `offset_simpl` при запросе.
Фильтрует ответы по датам, которые указаны в файлике `dateOfOffset.js`

# Как?

Отправлять `GET` запрос с `path` `/`.
В query string указывать `soc` - СОК, и `reg` - Регион

Пример:

```
http://ms-hdweb001.bee.vimpelcom.ru:3099/?soc=soc123&reg=region123
```

Возвращает результат:

```JS
[
  {
    options: String, // Данные, которые в базе
    date: String, // Дата в ISO формате (ISO 8601)
  },
];
```
