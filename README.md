# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- `src/` - исходные файлы проекта
- `src/components/` - папка с JS компонентами
- `src/components/base/` - папка с базовыми компонентами
- `src/components/view/` - папка с компонентами отображения

Важные файлы:

- `src/pages/index.html` - HTML-файл главной страницы
- `src/types/index.ts` - файл с типами
- `src/index.ts` - точка входа приложения
- `src/scss/styles.scss` - корневой файл стилей
- `src/utils/constants.ts` - файл с константами
- `src/utils/utils.ts` - файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды:

```bash
npm install
npm run start
```

или

```bash
yarn
yarn start
```

## Сборка

```bash
npm run build
```

или

```bash
yarn build
```

# Архитектура и описание компонентов

## Базовые классы

### **Api**

(`src/components/base/api.ts`)

- **Назначение**: Выполнение HTTP-запросов к серверу и обработка ответов.
- **Конструктор**: `constructor(baseUrl: string, options: RequestInit = {})`
- **Параметры**:
  - `baseUrl`: Базовый URL для API.
  - `options`: Объект настроек запроса
- **Поля**:
  - `baseUrl: string` - хранит базовый URL.
  - `options: RequestInit` - настройки для запросов.
- **Методы**:
  - `get(uri: string): Promise<T>` Выполняет GET запрос по указанному URI и возвращает промис с данными.
  - `post(uri: string, data: object, method?: 'POST' | 'PUT' | 'DELETE'): Promise<T>` Выполняет запрос с отправкой данных.

### **EventEmitter**

(`src/components/base/events.ts`)

- **Назначение**: Реализует механизм событий для связи между компонентами приложения.
- **Конструктор**: `constructor()` Не принимает параметров, инициализирует внутреннюю карту слушателей.
- **Поля**:
  - `_events: Map<string | RegExp, Set>` карта, где ключ - имя события или RegExp для шаблонного поиска, а значение - набор обработчиков.
- **Методы**:
  - `on(event: string | RegExp, callback: (data: T) => void): void` Регистрирует обработчик для указанного события.
  - `off(event: string | RegExp, callback: Function): void` Удаляет зарегистрированный обработчик для события.
  - `emit(event: string, data?: T): void` Инициирует событие с заданным именем, вызывая все соответствующие обработчики и передавая им данные.
  - `onAll(callback: (event: { eventName: string; data: any }) => void): void` Регистрирует обработчик, реагирующий на все события.
  - `offAll(): void` Удаляет все зарегистрированные обработчики.
  - `trigger(event: string, context?: Partial): (data: T) => void` Возвращает функцию, которая при вызове объединяет переданные данные с контекстом и инициирует событие.

### **BaseElementView**

(`src/components/base/BaseElementView.ts`)

- **Назначение**: Базовый абстрактный класс для представления UI-компонентов, обеспечивающий общий интерфейс для работы с DOM-элементами.
- **Конструктор**: Не имеет публичного конструктора (абстрактный класс).
- **Поля**:
  - `protected abstract baseElement: Element` - абстрактное защищенное поле для хранения DOM-элемента компонента.
- **Методы**:
  - `getElement(): Element` - возвращает DOM-элемент компонента.
  - `abstract render(...args: unknown[]): void` - абстрактный метод для отрисовки компонента, должен быть реализован в наследниках.

### **BaseFormView**

(`src/components/base/BaseFormView.ts`)

- **Назначение**: Абстрактный класс для представления UI-форм с обработкой ошибок и управлением состоянием кнопки отправки.
- **Конструктор**: `constructor()` - вызывает конструктор родительского класса BaseElementView.
- **Поля**:
  - `protected abstract errorContainer: Element` - абстрактное защищенное поле для контейнера сообщений об ошибках.
  - `protected abstract submitButton: HTMLButtonElement` - абстрактное защищенное поле для кнопки отправки формы.
- **Методы**:
  - `setError(message: string): void` - устанавливает текст сообщения об ошибке.
  - `setSubmitButtonStatus(isActive: boolean): void` - управляет состоянием кнопки отправки.
  - `abstract reset(): void` - абстрактный метод для сброса формы к исходному состоянию.

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
  total: number ;
  items: Product['id'][];
}
```

### **Модели данных**

#### **BasketModel**

- **Назначение**: Управление корзиной покупок
- **Методы**:
  - `add(product: Product): void` – добавляет товар в корзину
  - `remove(product: Product): void` – удаляет товар из корзины
  - `getTotal(): number` – вычисляет общую стоимость корзины
  - `getItemsCount(): number` – возвращает количество товаров в корзине
  - `clear(): void` – очищает корзину
  - `getItems(): Product[]` – возвращает массив товаров
  - `getItem(): Product | undefined` – возвращает товар по ID

#### **CatalogModel**

- **Назначение**: Управление каталогом товаров
- **Методы**:
  - `setItems(items: Product[]): void` – устанавливает список товаров
  - `getItemById(id: string): Product` – возвращает товар по ID
  - `getItems(): Product[]` – возвращает все товары

#### **AppStateModel**

- **Назначение**: Центральное состояние приложения
- **Методы**:
  - `getOrderRequestBody(): OrderRequestBody` – формирует данные для заказа
  - `getBasket(): BasketModel` – возвращает модель корзины
  - `getCatalog(): CatalogModel` – возвращает модель каталога
  - `getEvents(): EventEmitter` – возвращает шину событий
  - `setOrderDetails(details: OrderFormDetails | ContactsFormDetails): void` – обновляет данные заказа

### **Компоненты отображения**

#### **BasketView**

- **Назначение**: Отображение корзины покупок
- **Методы**:
  - `render(args: { productsMap: Map<string, number>, productsArray: Product[], total: number }): void` – отрисовывает корзину
- **Параметры конструктора (события)**:
  - `onStartOrder: (e: Event) => void` – начало оформления заказа
  - `onBasketItemRemove: (product: Product) => void` – удаление товара из корзины
  - `onBasketOpen: () => void` – открытие корзины

#### **OrderForm**

- **Назначение**: Форма оформления заказа (адрес и способ оплаты)
- **Методы**:
  - `render(details: OrderFormDetails): void` – отрисовывает форму
- **Параметры конструктора (события)**:
  - `onSubmit: (details: OrderFormDetails) => void` – отправка формы
  - `onOrderDetailsChange: (details: OrderFormDetails) => void` – изменение данных формы

#### **ContactsForm**

- **Назначение**: Форма контактных данных
- **Методы**:
  - `render(details: ContactsFormDetails): void` – отрисовывает форму
- **Параметры конструктора (события)**:
  - `onSubmit: (details: ContactsFormDetails) => void` – отправка формы
  - `onOrderDetailsChange: (details: ContactsFormDetails) => void` – изменение данных формы

#### **GalleryView**

- **Назначение**: Отображение каталога товаров
- **Методы**:
  - `render(items: Product[]): void` – отрисовывает галерею товаров
- **Параметры конструктора (события)**:
  - `onCardClick: (product: Product) => void` – клик по карточке товара

#### **HeaderView**

- **Назначение**: Отображение шапки приложения
- **Методы**:
  - `render(totalItemsCount: number): void` – отрисовывает шапку с количеством товаров

#### **OrderConfirmationView**

- **Назначение**: Отображение подтверждения заказа
- **Методы**:
  - `render(totalPrice: number): void` – отрисовывает подтверждение заказа
- **Параметры конструктора (события)**:
  - `onCloseButtonClick: () => void` – закрытие окна подтверждения

#### **CardDetails**

- **Назначение**: Отображение детальнрй информации о товаре
- **Методы**:
  - `render(product: Product): void` – отрисовывает детали товара
- **Параметры конструктора (события)**:
  - `isBasketButtonActive: boolean` – флаг для определения состояния кнопки добавления в корзину.
  - `onBasketAdd: (e: Event) => void` – добавление товара в корзину

## **События приложения**

### **Открытие товара**

- **details:open** - открытие детальной карточки товара

```typescript
{
	product: Product;
}
```

### **Корзина**

- **basket:add** - добавление товара в корзину

```typescript
{
	product: Product;
}
```

- **basket:remove** - удаление товара из корзины

```typescript
{
	product: Product;
}
```

- **basket:change** - изменение состояния корзины (без данных)
- **basket:open** - открытие модального окна корзины (без данных)

### **Оформление заказа**

- **order:open** - открытие формы заказа (без данных)
- **order:change** - изменение данных в форме заказа

```typescript
{
	details: OrderFormDetails;
}
```

- **order:submit** - отправка формы заказа

```typescript
{
	details: OrderFormDetails;
}
```

### **Контактные данные**

- **contacts:open** - открытие формы контактов (без данных)
- **contacts:change** - изменение данных в форме контактов

```typescript
{
	details: ContactsFormDetails;
}
```

- **contacts:submit** - отправка формы контактов

```typescript
{
	details: ContactsFormDetails;
}
```
