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
     var calculateTotal = function (type) {
         var sum = 0;
         data.allItems[type].forEach(function (cur) {
             sum += cur.value;
         });
         data.totals[type] = sum;
     };
     var data = {
         allItems: {
             exp: [],
             inc: []
         },
         totals: {
             exp: 0,
             inc: 0
         },
         budget: 0,
         percentage: -1
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
         deleteItem: function (type, id) {
             var ids, index;
             ids = data.allItems[type].map(function (current) {
                 return current.id;
             });
             index = ids.indexOf(id);
             if (index !== -1) {
                 data.allItems[type].splice(index, 1);
             }
         },
         calculateBudget: function () {
             // 1. Calculate total income and expenses
             calculateTotal('exp');
             calculateTotal('inc');
             // 2. Calculate budget: income - expenses
             data.budget = data.totals.inc - data.totals.exp;
             // 3. Calculate the percentage of income that is used
             if (data.totals.inc > 0) {
                 data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
             } else {
                 data.percentage = -1;
             }
         },
         getBudget: function () {
             return {
                 budget: data.budget,
                 totalInc: data.totals.inc,
                 totalExp: data.totals.exp,
                 percentage: data.percentage
             };
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
         expensesContainer: '.expenses-list',
         budgetLabel: '.budget-value',
         incomeLabel: '.budget-income-value',
         expensesLabel: '.budget-expenses-value',
         percentageLabel: '.budget-expenses-percentage',
         container: '.container'
     };
     var formatNumber = function (num, type) {
         var numSplit, int, dec, type;
         num = Math.abs(num);
         num = num.toFixed(2);
         numSplit = num.split('.');
         int = numSplit[0];
         if (int.length > 3) {
             int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
         }
         dec = numSplit[1];
         return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
     };
     return {
         getinput: function () {
             return {
                 // Will be either `inc` or `exp` 
                 type: document.querySelector(DOMstrings.inputType).value,
                 description: document.querySelector(DOMstrings.inputDescription).value,
                 value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
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
                 html = '<div class="item clearfix" id="exp-%id%"><div class="item-description">%description%</div><div class="right clearfix"><div class="item-value">%value%</div><div class="item-delete"><button class="item-delete-btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
             }
             // Replace the placeholder text with user inputed data
             newHtml = html.replace('%id%', obj.id);
             newHtml = newHtml.replace('%description%', obj.description);
             newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
             // Insert the replaced HTML into the DOM
             document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
         },
         deleteListItem: function (selectorID) {
             var el = document.getElementById(selectorID);
             el.parentNode.removeChild(el);
         },
         clearFields: function () {
             var fields, fieldsArr;
             fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
             fieldsArr = Array.prototype.slice.call(fields);
             fieldsArr.forEach(function (current, index, array) {
                 current.value = "";
             });
             fieldsArr[0].focus();
         },
         displayBudget: function (obj) {
             var type;
             obj.budget > 0 ? type = 'inc' : type = 'exp';
             document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
             document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc);
             document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp);
             if (obj.percentage > 0) {
                 document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
             } else {
                 document.querySelector(DOMstrings.percentageLabel).textContent = '---';
             }
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
             }
         });
         document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
     };
     var updateBudget = function () {
         // 1. Calculate the budget
         budgetCtrl.calculateBudget();
         // 2. Return the budget
         var budget = budgetCtrl.getBudget();
         // 3. Display the budget
         UICtrl.displayBudget(budget);
     };
     var ctrlAddItem = function () {
         var input, newItem;
         // 1. Get the input data
         input = UICtrl.getinput();
         if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
             // 2. Add item to the budget controller
             newItem = budgetCtrl.addItem(input.type, input.description, input.value);
             // 3. Add the new item to the interface
             UICtrl.addListItem(newItem, input.type);
             // 4. Clear fields
             UICtrl.clearFields();
             // 5. Calculate and update budget
             updateBudget();
         }
     };
     var ctrlDeleteItem = function (event) {
         var itemID, splitID, type, ID;
         itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
         if (itemID) {
             splitID = itemID.split('-');
             type = splitID[0];
             ID = parseInt(splitID[1]);
             // 1. Delete item
             budgetCtrl.deleteItem(type, ID);
             // 2. Delete item from UI
             UICtrl.deleteListItem(itemID);
             // 3. Update and show new budget
             updateBudget();
         }
     };
     return {
         init: function () {
             console.log('App has started.');
             // Clears budget on start
             UICtrl.displayBudget({
                 budget: 0,
                 totalInc: 0,
                 totalExp: 0,
                 percentage: -1
             });
             setupEventListeners();
         },
     };
 })(budgetController, UIController);
 /////////////////////////////////////
 controller.init(); //////////////////