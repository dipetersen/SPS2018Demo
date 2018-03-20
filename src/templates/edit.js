import config from "../config.js"

export default (data) => {
    return `
<div class="row">
  <div class="col-2">
    <img class="avatar" src="${data.avatar == null || data.avatar.length == 0 ? `../siteassets/${config.appname}/assets/avatar-generic.png` : data.avatar}" alt="${"".concat(data.title, ' ', data.last_name)}" />
  </div>
  <div class="col-10">
    <div class="form-group">
      <label for="Title">First Name</label>
      <input id="Title" class="form-control" type="text" value="${data.Title == null ? '' : data.Title}">
    </div>
    <div class="form-group">
      <label for="last_name">Last Name</label>
      <input id="last_name" class="form-control" type="text" value="${data.last_name == null ? '' : data.last_name}">
    </div>
    <div class="form-group">
      <label for="company">Company</label>
      <input id="company" class="form-control" type="text" value="${data.company == null ? '' : data.company}">
    </div>
    <div class="form-group">
      <label for="email">E-Mail</label>
      <input id="email" class="form-control" type="text" value="${data.email == null ? '' : data.email}">
    </div>
    <div class="form-group">
      <label for="description">Description</label>
      <textarea id="description" class="form-control">${data.description == null ? '' : data.description}</textarea>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-12">
    <div class="float-right">
      <button class="btn btn-outline-default edit-form-button" data-action="save" data-id="${data.Id}" type="button">Save</button>
      <button class="btn btn-outline-default edit-form-button" data-action="cancel" type="button">Cancel</button>
    </div>
  </div>
</div>
`
}