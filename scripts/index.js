const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileFormElement = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const cardFormElement = document.querySelector('.popup__form[name="new-place"]');
const cardNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardFormElement.querySelector('.popup__input_type_url');
const placesList = document.querySelector('.places__list');
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');

profilePopup.classList.add("popup_is-animated");
cardPopup.classList.add("popup_is-animated");
imagePopup.classList.add("popup_is-animated");

function createCard(data) {
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  likeButton.addEventListener('click', () => {
    likeButton.classList.toggle('card__like-button_is-active');
  });

  deleteButton.addEventListener('click', () => {
    cardElement.remove();
  });

  cardImage.addEventListener('click', () => {
    popupImage.src = data.link;
    popupImage.alt = data.name;
    popupCaption.textContent = data.name;
    openModal(imagePopup);
  });

  return cardElement;
}

function clearForm(form) {
  form.reset();
}

function renderInitialCards() {
  initialCards.forEach((card) => {
    const cardElement = createCard(card);
    placesList.append(cardElement);
  });
}

function openModal(popup) {
  popup.classList.add('popup_is-opened');
}

function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
}

document.querySelectorAll('.popup__close').forEach((button) => {
  const popup = button.closest('.popup');
  button.addEventListener('click', () => closeModal(popup));
});

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(profilePopup);
  updateButtonState(profileFormElement);
});

profileFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(profilePopup);
});

document.querySelector('.profile__add-button').addEventListener('click', () => {
  clearForm(cardFormElement);
  openModal(cardPopup);
  updateButtonState(cardFormElement);
});

cardFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newCard = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };
  placesList.prepend(createCard(newCard));
  closeModal(cardPopup);
});

renderInitialCards();

function handleEscapeKey(evt) {
    if (evt.key === 'Escape') {
      const openedPopup = document.querySelector('.popup_is-opened');
      if (openedPopup) {
        closeModal(openedPopup);
      }
    }
  }
  
  document.addEventListener('keydown', handleEscapeKey);

  function setupPopupCloseListeners() {
    document.querySelectorAll('.popup').forEach(popup => {
      popup.addEventListener('click', (evt) => {
        if (evt.target === popup) {
          closeModal(popup);
        }
      });
    });
  }
  
  // Вызовите эту функцию в конце вашего кода
  const showInputError = (form, inputElement, errorMessage) => {
    const errorElement = form.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add('popup__input_type_error');
    errorElement.textContent = errorMessage;
    errorElement.classList.add('popup__input-error_active');
  };
  
  const hideInputError = (form, inputElement) => {
    const errorElement = form.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove('popup__input_type_error');
    errorElement.textContent = '';
    errorElement.classList.remove('popup__input-error_active');
  };
  
  const checkInputValidity = (form, inputElement) => {
    if (!inputElement.validity.valid) {
      showInputError(form, inputElement, inputElement.validationMessage);
    } else {
      hideInputError(form, inputElement);
    }
  };
  
  const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => {
      return !inputElement.validity.valid;
    });
  };
  
  const toggleButtonState = (inputList, buttonElement) => {
    if (hasInvalidInput(inputList)) {
      buttonElement.classList.add("popup__button_inactive");
    } else {
      buttonElement.classList.remove('popup__button_inactive');
    }
  };
  
  const setEventListeners = (form) => {
    const inputList = Array.from(form.querySelectorAll('.popup__input'));
    const buttonElement = form.querySelector('.popup__button');
    toggleButtonState(inputList, buttonElement);
  
    inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', function () {
        checkInputValidity(form, inputElement);
        toggleButtonState(inputList, buttonElement);
      });
    });
  };

  const updateButtonState = (form) => {
    const inputList = Array.from(form.querySelectorAll('.popup__input'));
    const buttonElement = form.querySelector('.popup__button');
    toggleButtonState(inputList, buttonElement);
  };
  
  const enableValidation = () => {
    const formList = Array.from(document.querySelectorAll('.popup__form'));
    formList.forEach((form) => {
      form.addEventListener('submit', function (evt) {
        evt.preventDefault();
      });
  
      setEventListeners(form)
    })
  };


  setupPopupCloseListeners();
  enableValidation();