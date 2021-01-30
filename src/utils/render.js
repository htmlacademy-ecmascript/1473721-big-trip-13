import Abstract from "../view/abstract.js";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  REFERENCE: `reference`,
  INSERT_BEFORE: `insertBefore`
};

export const renderTemplate = (container, template, place = RenderPosition.BEFOREEND) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  container.insertAdjacentHTML(place, template);
};

export const render = (container, template, place = RenderPosition.BEFOREEND, element) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (template instanceof Abstract) {
    template = template.getElement();
  }

  switch (place) {
    case RenderPosition.BEFOREEND:
      container.append(template);
      break;
    case RenderPosition.AFTERBEGIN:
      container.prepend(template);
      break;
    case RenderPosition.INSERT_BEFORE:
      container.insertBefore(template, element);
  }
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

export const getOfferId = (title, id) => `event-offer-${title}-${id}`;
