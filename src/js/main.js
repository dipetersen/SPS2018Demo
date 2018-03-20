import config from './config.js'
import { IsEqual } from './compareobject.js'
import pnp from 'sp-pnp-js'
// import the templates
import editForm from './templates/edit.js'

const EmptyDataObject = {
    Title: '',
    last_name: '',
    company: '',
    email: '',
    description: '',
    avatar: ''
}

let demodata = [];
let formData = {};

function Toast(type, msg, options) {
    toastr.options = $.extend({}, {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }, options)
    toastr[type](msg);
}

function HandleNavLinkClicks(e) {
    e.preventDefault();
    const whichLink = $(e.target).data("function");
    switch (whichLink) {
        case "New":
            formData = {};
            formData = $.extend({}, EmptyDataObject);
            $("#app-container").html(editForm(EmptyDataObject));
            break;
        default:
            DisplayList();
    }
}

function HandleAvatarClick(e) {
    console.log("HandleAvatarClick");
    e.preventDefault();
    const img = GetRandomImage();
    e.target.src = img;
    formData.avatar = img;
}

function HandleEditFormButton(e) {
    console.log("HandleEditFormButton");
    e.preventDefault();
    const action = $(e.target).data("action");
    switch (action) {
        case "save":
            console.log("save");
            const id = $(e.target).data("id");
            console.log("id", id);
            if (id === undefined || id === 'undefined') {
                // add new data
                console.log("add new list item", formData);
                formData.avatar = (formData.avatar == null || formData.avatar.length == 0) ? GetRandomImage() : formData.avatar;
                pnp.sp.web.lists.getByTitle("MockData").items.add(formData)
                    .then(results => {
                        console.log("results", results);
                        Toast("success", "New Item Saved.");
                        demodata.push(results.data);
                        DisplayList();
                        return;
                    })
            } else {
                // update existing item
                const origItem = demodata.find(d => d.Id == id);
                console.log("origItem", origItem);
                console.log("formData", formData);
                if (!IsEqual(origItem, formData)) {
                    console.log("They are not equal");
                    // get current index and update the original item.
                    formData.avatar = (formData.avatar == null || formData.avatar.length == 0) ? GetRandomImage() : formData.avatar;
                    const idx = demodata.findIndex(d => d.Id == id);
                    console.log("idx", idx);
                    demodata[idx] = formData;
                    pnp.sp.web.lists.getByTitle("MockData").items.getById(id).update(formData)
                        .then(results => {
                            console.log("results", results);
                            Toast("success", "Item updated.");
                            DisplayList();
                            return;
                        })
                } else {
                    console.log("objects are equal");
                    DisplayList();
                }
            }
            break;
        default:
            DisplayList();
    }
}

function GetRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function GetRandomImage() {
    const generators = [
        'https://www.placecage.com', 'https://www.placecage.com/g', 'https://www.placecage.com/c', 'https://baconmockup.com', 'https://fillmurray.com',
        'https://fillmurray.com/g', 'https://stevensegallery.com', 'https://stevensegallery.com/g', 'https://placebear.com', 'https://lorempixel.com',
        'https://placebeard.it'
    ];
    return `${generators[GetRandomInt(generators.length)]}/150/150`;
}



function HandleFormChange(e) {
    console.log("HandleFormChange");
    e.preventDefault();
    formData[e.target.id] = e.target.value;
}


function DisplayList(refresh = false) {
    console.log("DisplayList");
    $("#app-container").html("<TABLE id='app-table' class='table table-condensed display' cellspacing='0' width='100%' />");
    const dataTableConfig = {
        data: demodata,
        pageLength: 25,
        info: false,
        order: [2, 'asc'],
        columns: [{
                data: "Id",
                render: id => `<i class='fas fa-edit edit-item' data-id='${id}'></i>`,
                className: 'dt-body-center',
                orderable: false
            },
            {
                data: "avatar",
                render: avatar => `<img src="${avatar}" height="50" width="50" />`,
                className: 'dt-body-center',
                orderable: false
            },
            { data: "last_name", title: "Last Name", type: "string" },
            { data: "Title", title: "First Name", type: "string" },
            { data: "company", title: "Company", type: "string" },
            { data: "email", title: "E-Mail", type: "string" },
            {
                data: "Id",
                render: id => `<i class='fas fa-trash-alt delete-item' data-id='${id}'></i>`,
                className: 'dt-body-center',
                orderable: false
            }
        ]
    };
    console.log("dataTableConfig", dataTableConfig);
    console.log("demodata.length: ", demodata.length);
    if (demodata.length > 0 && refresh == false) {
        $("#app-table").DataTable(dataTableConfig)
    } else {
        pnp.sp.web.lists.getByTitle("MockData").items.select("Id,Title, last_name, company, email, avatar, description").orderBy("last_name").get()
            .then(d => {
                console.log("d", d);
                d.forEach((el, idx) => d[idx].avatar = el.avatar.replace('http://', 'https://'));
                demodata = d;
                console.log("demodata", demodata);
                dataTableConfig.data = demodata;
                $("#app-table").DataTable(dataTableConfig);
            })
    }
}

function EditListItem(e) {
    console.log("EditListItem");
    e.preventDefault();
    // make sure old values are cleared.
    formData = {};
    const id = $(e.target).data("id");
    console.log("edit id: ", id);
    const itm = demodata.find(d => d.Id == id);
    formData = $.extend({}, EmptyDataObject, itm);
    $("#app-container").html(editForm(formData));
}

function DeleteListItem(e) {
    console.log("DeleteListItem");
    e.preventDefault();
    const id = $(e.target).data("id");
    console.log("delete id: ", id);
    demodata = demodata.filter(d => d.Id !== id);
    pnp.sp.web.lists.getByTitle("MockData").items.getById(id).delete()
        .then(r => {
            console.log("results of delete", r);
            Toast("success", "Item Deleted");
            DisplayList();
        })
}



$(document).ready(() => {
    pnp.setup({
        sp: {
            headers: {
                "Accept": "application/json;odata=nometadata"
            }
        }
    });
    $(".navbar").on("click", ".nav-link", HandleNavLinkClicks);
    $("#app-container").on("click", ".edit-item", EditListItem);
    $("#app-container").on("click", ".delete-item", DeleteListItem);
    $("#app-container").on("click", ".edit-form-button", HandleEditFormButton);
    $("#app-container").on("change", HandleFormChange);
    $("#app-container").on("click", ".avatar", HandleAvatarClick);
    DisplayList();
})