# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым компонентами
- src/components/view/ — папка с компонентами отображения

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Архитектура и описание компонентов

## Базовые классы

### **Api**

(src/components/base/api.ts)

Назначение:
Выполнение HTTP-запросов к серверу и обработка ответов.

Конструктор:
`constructor(baseUrl: string, options: RequestInit = {})`

Параметры:

- `baseUrl`: Базовый URL для API.
- `options`: Объект настроек запроса

Поля:

- `baseUrl: string` - хранит базовый URL.
- `options: RequestInit` - настройки для запросов.

Методы:

- `get(uri: string): Promise<T>` Выполняет GET запрос по указанному URI и возвращает промис с данными.
- `post(uri: string, data: object, method?: 'POST' | 'PUT' | 'DELETE'): Promise<T>` Выполняет запрос с отправкой данных.

### **EventEmitter**

(src/components/base/events.ts)

Назначение:
Реализует механизм событий для связи между компонентами приложения.

Конструктор:
`constructor()` Не принимает параметров, инициализирует внутреннюю карту слушателей.

Поля:

- `_events: Map<string | RegExp, Set>` карта, где ключ — имя события или RegExp для шаблонного поиска, а значение — набор обработчиков.

Методы:

- `on(event: string | RegExp, callback: (data: T) => void): void` Регистрирует обработчик для указанного события.
- `off(event: string | RegExp, callback: Function): void` Удаляет зарегистрированный обработчик для события.
- `emit(event: string, data?: T): void` Инициирует событие с заданным именем, вызывая все соответствующие обработчики и передавая им данные.
- `onAll(callback: (event: { eventName: string; data: any }) => void): void` Регистрирует обработчик, реагирующий на все события.
- `offAll(): void` Удаляет все зарегистрированные обработчики.
- `trigger(event: string, context?: Partial): (data: T) => void` Возвращает функцию, которая при вызове объединяет переданные данные с контекстом и инициирует событие.

### **BaseElementView**

(src/components/base/BaseElementView.ts)

**Назначение**: Базовый абстрактный класс для представления UI-компонентов, обеспечивающий общий интерфейс для работы с DOM-элементами.

**Конструктор**: Не имеет публичного конструктора (абстрактный класс).

**Поля**:

- `protected abstract baseElement: Element` - абстрактное защищенное поле для хранения DOM-элемента компонента.

**Методы**:

- `getElement(): Element` - возвращает DOM-элемент компонента.
- `abstract render(...args: unknown[]): void` - абстрактный метод для отрисовки компонента, должен быть реализован в наследниках.

### **BaseFormView**

(src/components/base/BaseFormView.ts)

**Назначение**: Управление формами с обработкой ошибок и состоянием кнопки отправки.

**Конструктор**: Не имеет публичного конструктора (абстрактный класс).

**Поля**:

- `errorContainer: Element` - контейнер для ошибок
- `submitButton: HTMLButtonElement` - кнопка отправки

**Методы**:

- `setError(message)` - устанавливает текст ошибки
- `setSubmitButtonStatus(isActive)` - управляет состоянием кнопки
- `abstract reset()` - абстрактный метод для сброса формы, должен быть реализован в наследниках.

## **Типы приложения (src/types.ts)**

### **Основные сущности**

**Product** - товар/продукт

```typescript
{
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductCategory;
	price: number | null;
}
```

**Order** - заказ

```typescript
{
	id: string;
	total: number;
}
```

**Basket** - корзина `(Map<Product['id'], number>)`

### **Категории**

**ProductCategory** - тип категории товара

```typescript
'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';
```

### **Оформление заказа**

**OrderDetails** - данные заказа

```typescript
{
	paymentVariant: PaymentVariant;
	address: string;
	email: string;
	phoneNumber: string;
}
```

**PaymentVariant** - способ оплаты

```typescript
'Онлайн' | 'При получении';
```

**OrderRequestBody** - тело запроса для оформления заказа

```typescript
{
  address: string;
  email: string;
  phone: string;
  payment: 'online' | 'cash';
  total: number | 'Бесценно';
  items: Product['id'][];
}
```

### **Модели данных**

**BasketModel** - модель корзины

```typescript
{
  add(product): void;
  remove(product): void;
  getTotal(): number;
  getItemsCount(): number;
  clear(): void;
  getItemsMap(): Map<string, number>;
  getItemsArray(): Product[];
}
```

**CatalogModel** - модель каталога

```typescript
{
  setItems(items): void;
  getItemById(id): Product;
  getItems(): Product[];
}
```

**AppStateModel** - модель состояния приложения

```typescript
{
  getOrderRequestBody(): OrderRequestBody;
  getBasket(): BasketModel;
  getCatalog(): CatalogModel;
  getEvents(): EventEmitter;
  setOrderDetails(details): void;
}
```

### **Компоненты (View)**

**BaseElementView** - базовый компонент

```typescript
{
  render(...args): void;
  getElement(): Element;
}
```

**BaseFormView** - базовая форма

```typescript
{
  reset(): void;
  setError(message): void;
  setSubmitButtonStatus(isActive): void;
}
```

### **События (Events)**

**PreviewOpenEvent** - открытие превью товара

```typescript
{
	product: Product;
}
```

**BasketAddEvent** - добавление в корзину

```typescript
{
	product: Product;
}
```

**BasketRemoveEvent** - удаление из корзины

```typescript
{
	product: Product;
}
```

**OrderFormSubmitEvent** - отправка формы заказа

```typescript
{
	details: OrderFormDetails;
}
```

**ContactsFormSubmitEvent** - отправка контактов

```typescript
{
	details: ContactsFormDetails;
}
```

#### **BasketModel**

**Назначение**: Управление корзиной покупок

**Поля**:

- `items: Map<Product['id'], number>` — товары и их количество

**Методы**:

- `add(product: Product): void` – добавляет товар в корзину
- `remove(product: Product): void` – удаляет товар из корзины
- `getTotal(): number` – вычисляет общую стоимость корзины
- `getItemsCount(): number` – возвращает количество товаров в корзине
- `clear(): void` – очищает корзину
- `getItemsMap(): Map<string, number>` – возвращает карту товаров
- `getItemsArray(): Product[]` – возвращает массив товаров

---

#### **CatalogModel**

**Назначение**: Управление каталогом товаров

**Поля**:

- `items: Product[]` — список товаров

**Методы**:

- `setItems(items: Product[]): void` – устанавливает список товаров
- `getItemById(id: string): Product` – возвращает товар по ID
- `getItems(): Product[]` – возвращает все товары

---

#### **AppStateModel**

**Назначение**: Центральное состояние приложения

**Поля**:

- `basket: BasketModel` — корзина
- `catalog: CatalogModel` — каталог
- `events: EventEmitter` — шина событий
- `orderDetails: OrderDetails` — данные заказа

**Методы**:

- `getOrderRequestBody(): OrderRequestBody` – формирует данные для заказа
- `getBasket(): BasketModel` – возвращает модель корзины
- `getCatalog(): CatalogModel` – возвращает модель каталога
- `getEvents(): EventEmitter` – возвращает шину событий
- `setOrderDetails(details: OrderFormDetails | ContactsFormDetails): void` – обновляет данные заказа

### **Классы отображения**

#### **BasketView**

**Назначение**: Отображение корзины покупок

**Методы**:

- `render(args: { productsMap: Map<string, number>, productsArray: Product[], total: number }): void` – отрисовывает корзину

**События**:

- `onStartOrder: (e: Event) => void` – начало оформления заказа
- `onBasketItemRemove: (product: Product) => void` – удаление товара из корзины
- `onBasketOpen: () => void` – открытие корзины

---

#### **OrderForm**

**Назначение**: Форма оформления заказа (адрес и способ оплаты)

**Методы**:

- `render(details: OrderFormDetails): void` – отрисовывает форму

**События**:

- `onSubmit: (details: OrderFormDetails) => void` – отправка формы
- `onOrderDetailsChange: (details: OrderFormDetails) => void` – изменение данных формы

---

#### **ContactsForm**

**Назначение**: Форма контактных данных

**Методы**:

- `render(details: ContactsFormDetails): void` – отрисовывает форму

**События**:

- `onSubmit: (details: ContactsFormDetails) => void` – отправка формы
- `onOrderDetailsChange: (details: ContactsFormDetails) => void` – изменение данных формы

---

#### **GalleryView**

**Назначение**: Отображение каталога товаров

**Методы**:

- `render(items: Product[]): void` – отрисовывает галерею товаров

**События**:

- `onCardClick: (product: Product) => void` – клик по карточке товара

---

#### **HeaderView**

**Назначение**: Отображение шапки приложения

**Методы**:

- `render(totalItemsCount: number): void` – отрисовывает шапку с количеством товаров

---

#### **OrderConfirmationView**

**Назначение**: Подтверждение заказа

**Методы**:

- `render(totalPrice: number): void` – отрисовывает подтверждение заказа

**События**:

- `onCloseButtonClick: () => void` – закрытие окна подтверждения

---

#### **CardDetails**

**Назначение**: Детальная информация о товаре

**Методы**:

- `render(product: Product): void` – отрисовывает детали товара

**События**:

- `onBasketAdd: (e: Event) => void` – добавление товара в корзину

## **События приложения (events.ts)**

(src/types/index.ts)

### **Открытие товара**

**details:open** - открытие детальной карточки товара

```typescript
{
	product: Product; // данные товара
}
```

### **Корзина**

**basket:add** - добавление товара в корзину

```typescript
{
	product: Product; // добавляемый товар
}
```

**basket:remove** - удаление товара из корзины

```typescript
{
	product: Product; // удаляемый товар
}
```

**basket:change** - изменение состояния корзины (без данных)

**basket:open** - открытие модального окна корзины (без данных)

### **Оформление заказа**

**order:open** - открытие формы заказа (без данных)

**order:change** - изменение данных в форме заказа

```typescript
{
	details: OrderFormDetails; // адрес и способ оплаты
}
```

**order:submit** - отправка формы заказа

```typescript
{
	details: OrderFormDetails; // данные формы
}
```

### **Контактные данные**

**contacts:open** - открытие формы контактов (без данных)

**contacts:change** - изменение данных в форме контактов

```typescript
{
	details: ContactsFormDetails; // email и телефон
}
```

**contacts:submit** - отправка формы контактов

```typescript
{
	details: ContactsFormDetails; // данные формы
}
```
