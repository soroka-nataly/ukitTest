$(document).ready(function () {
//localStorage.clear();
    BooksList = (localStorage['BooksList']) ? JSON.parse(localStorage.getItem('BooksList')) : [];
    updateBooksListView();
    $("#book_info").submit(function () {

        let book_data = [];
        $('#book_info').find('input, textearea, select').each(function () {
            book_data[this.name] = $(this).val();
        });
        if (validateBook(book_data)) {
            let book = new Book(book_data);
            if (book_data.id === "NaN") {
                book.createBook();
            } else {
                book.updateBook(book_data.id);
            }
            updatelocalStorage('BooksList', BooksList);
            updateBooksListView();
            $('#edit_form').css('background-color', '#fff');
            this.reset();
        } else {

        }
        return false;
    });
});

function clearStorage() {
    if (confirm('Вы действительно хотите очистить библиотеку?')) {
        localStorage.clear();
        BooksList = (localStorage['BooksList']) ? JSON.parse(localStorage.getItem('BooksList')) : [];
        updateBooksListView();
    }        
    return false;
}

function Book(book_data) {
    this.title = book_data['title'];
    this.author = book_data['author'];
    this.year = book_data['year'];
    this.pages_count = book_data['pages_count'];

    this.createBook = function () {
        BooksList.push(this);
    }

    this.updateBook = function (id) {
        BooksList[id] = this;
    }
}

function updateBooksListView() {
    $('#books_list').empty();
    $.each(BooksList, function (id, book) {
        $('#books_list').append(getBookHtml(id, book));
    });
}

function updatelocalStorage(title, obj) {
    localStorage.setItem(title, JSON.stringify(obj));
}

function getBookHtml(id, book) {
    let book_template = $('#book_template').html();
    let string_book = book_template.toString();
    string_book = string_book.replace(/##id##/g, id);
    $.each(book, function (name, value) {
        string_book = string_book.replace('##' + name + '##', value);
    });
    return string_book;
}

function deleteBook(id) {
    if (confirm('Удалить эту замечательную книгу из списка?')) {
        BooksList.splice(id, 1);
        updatelocalStorage('BooksList', BooksList);
        updateBooksListView();
    }        
    return false;
}

function editBook(id) {
    $('#edit_form').css('background-color', '#fafafa');
    let editable_book = BooksList[id];
    $('#book_info input[name=id]').val(id);
    $.each(editable_book, function (name, value) {
        $('#book_info input[name=' + name + ']').val(value);
    });
}

function validateBook(book_data) {
    let errors_array = [];
    if (book_data['title'] == "") {
        errors_array.push(['title', 'Поле Название должно быть заполнено']);
    }
    if (book_data['author'] == "") {
        errors_array.push(['author', 'Поле Автор должно быть заполнено']);
    }
    if (book_data['year'] == "") {
        errors_array.push(['year', 'Поле Год издания должно быть заполнено']);
    } else if (!($.isNumeric(book_data['year']) && book_data['year'] <= 2017 && book_data['year'] >= 1700)) {
        errors_array.push(['year', 'Поле Год издания должно быть годом с 1700 по 2017']);
    }
    if (book_data['pages_count'] == "") {
        errors_array.push(['pages_count', 'Выберите или введите количество страниц']);
    } else if (!($.isNumeric(book_data['pages_count']) && book_data['pages_count'] % 1 === 0)) {
        errors_array.push(['pages_count', 'Kоличество страниц должно быть целым числом']);
    }
    if (errors_array.length === 0) {
        return true;
    } else {
        showErrors(errors_array);
        return false;
    }
}

function showErrors(errors_array) {
    $(".error_msg").remove();
    $.each(errors_array, function (index, error) {
        $('[name=' + error[0] + ']').after('<span class="error_msg">' + error[1] + '</span>');
    });
}