import Abstract from "../view/abstract.js";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const renderTemplate = (container, template, place = RenderPosition.BEFOREEND) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  container.insertAdjacentHTML(place, template);
};

export const render = (container, template, place = RenderPosition.BEFOREEND) => {
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
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};
