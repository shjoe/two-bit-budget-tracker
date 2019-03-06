 // Budget Controller
 var budgetController = (function () {
     var Expense = function (id, description, value) {
         this.id = id;
         this.description = description;
         this.value = value;
     };
     var Income = function (id, description, value) {
         this.id = id;
         this.description = description;
         this.value = value;
     };

     var totalExpenses = 0;
     var data = {
         allItems: {
             exp: [],
             inc: []
         },
         totals: {
             exp: 0,
             inc: 0
         }
     };
     return {
         addItem: function (type, des, val) {
             var newItem;
             // Create new ID
             if (data.allItems[type].length > 0) {
                 ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
             } else {
                 ID = 0;
             }
             // Create new item based on `inc` or `exp`  
             if (type === 'exp') {
                 newItem = new Expense(ID, des, val);
             } else if (type === 'inc') {
                 newItem = new Income(ID, des, val);
             }
             // Push into data structure
             data.allItems[type].push(newItem);
             // Return new element
             return newItem;
         },
         testing: function () {
             console.log(data);
         }
     };
 })();

 // UI Controller
 var UIController = (function () {
     // Storage for all the strings for easy updating in the future
     var DOMstrings = {
         inputType: '.add-type',
         inputDescription: '.add-description',
         inputValue: '.add-value',
         inputBTN: '.add-btn',
         incomeContainer: '.income-list',
         expensesContainer: '.expenses-list'
     };
     return {
         getinput: function () {
             return {
                 // Will be either `inc` or `exp` 
                 type: document.querySelector(DOMstrings.inputType).value,
                 description: document.querySelector(DOMstrings.inputDescription).value,
                 value: document.querySelector(DOMstrings.inputValue).value,
             };
         },
         addListItem: function (obj, type) {
             var html, newHtml, element;
             // Create HTML string with placeholder text
             if (type === 'inc') {
                 element = DOMstrings.incomeContainer;
                 html = '<div class="item clearfix" id="inc-%id%"> <div class="item-description">%description%</div><div class="right clearfix"><div class="item-value">%value%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
             } else if (type === 'exp') {
                 element = DOMstrings.expensesContainer;
                 html = '<div class="item clearfix" id="exp-%id%"><div class="item-description">%description%</div><div class="right clearfix"><div class="item-value">%value%</div><div class="item-percentage">21%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
             } 
             // Replace the placeholder text with user inputed data
             newHtml = html.replace('%id%', obj.id);
             newHtml = newHtml.replace('%description%', obj.description);
             newHtml - newHtml.replace('%value%', obj.value);
             // Insert the replaced HTML into the DOM
             document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
         },
         getDOMstrings: function () {
             return DOMstrings;
         },
     };
 })();

 // Global App Controller
 var controller = (function (budgetCtrl, UICtrl) {
     var setupEventListeners = function () {
         var DOM = UICtrl.getDOMstrings();
         document.querySelector(DOM.inputBTN).addEventListener('click', ctrlAddItem);
         document.addEventListener('keypress', function (e) {
             // Keycode 13 is the `enter` key  
             if (e.keycode === 13 || event.which === 13) {
                 ctrlAddItem();
             };
         });
     };
     var ctrlAddItem = function () {
         var input, newItem;
         // 1. Get the input data
         input = UICtrl.getinput();
         // 2. Add item to the budget controller
         newItem = budgetCtrl.addItem(input.type, input.description, input.value);
         // 3. Add the new item to the interface
         UICtrl.addListItem(newItem, input.type);

         // 4. Calculate the budget
         // 5. Display the budget
     };
     return {
         init: function () {
             console.log('App has started.');
             setupEventListeners();
         },
     };
 })(budgetController, UIController);

 controller.init();