const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK APPS';


document.addEventListener('DOMContentLoaded', function () {
    const submitBook = document.getElementById('inputBook');
    submitBook.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    };
});

function addBook() {
    
    const inputTitle = document.getElementById('inputBookTitle').value;
    const inputAuthor = document.getElementById('inputBookAuthor').value;
    const inputYear = document.getElementById('inputBookYear').value;
    const checkBox = document.getElementById('inputBookIsComplete').checked;

    const generateID = generateId();
    const bookObject = bookObjectGenerate(generateID, inputTitle, inputAuthor, inputYear, checkBox);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function generateId() {
    return +new Date();
};

function bookObjectGenerate(id, title, author, year, isCompleted) {
    return {
    id,
    title,
    author,
    year,
    isCompleted
    }
};


function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('book_item');
    container.append(textContainer);
    container.setAttribute('id', 'book-${bookObject.id}');

    if (bookObject.isCompleted){
        const undoButton = document.createElement('button');
        undoButton.innerText = 'Belum Selesai Dibaca';
        undoButton.classList.add('green');

        undoButton.addEventListener('click', function (){
            undoTaskFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus Buku';
        trashButton.classList.add('red')

        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(bookObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const addButton = document.createElement('button');
        addButton.classList.add('green');
        addButton.innerText = 'Selesai Dibaca';
        addButton.addEventListener('click', function () {
            addBookToCompleted(bookObject.id);
        });

        const removeButton = document.createElement('button');
        removeButton.classList.add('red');
        removeButton.innerText = 'Hapus Buku';
        removeButton.addEventListener('click', function () {
            removeTaskFromCompleted(bookObject.id);
        });

        container.append(addButton, removeButton);
    }

    return container;


};

function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist()/*boolean*/ {
    if (typeof(Storage) === undefined) {
        alert('Browser kamu tidak mendukung localstorge')
        return false;
    } else {
        return true;
    }
};

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

function loadDataFromStorage() {
    const serializeData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializeData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function() {
    // console.log('incompleteBookshelfList');

    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('completeBookshelfList');
    completedBOOKList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted)
            uncompletedBOOKList.append(bookElement);
        else 
            completedBOOKList.append(bookElement);
    };


});


document.getElementById('searchBook').addEventListener('submit', function(event) {
    event.preventDefault();
    // searchBook();
// });

// function searchBook() {
//     const searchInput = document.getElementById('searchBookTitle').value
//     const bookList = document.querySelectorAll(".book_item");

//     for (const book of book_item)
//         if (searchInput !== book.innerText) {
//             console.log(book.innerText);
//             book.parentElement.remove();
//         }
// }

    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.book_item');
    for (const book of bookList) {
        if (book.innerText.toLowerCase().includes(searchBook)){
            book.parentElement.style.display = "block";
        } else {
            book.parentElement.style.display = "none";
        }

        console.log(book);
    }
});






