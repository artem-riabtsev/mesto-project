import '../pages/index.css';
import {
  getInitialCards,
  getInitialUserData,
  updateProfileDataRequest,
  updateProfileAvatarRequest,
  createNewCardRequest,
} from './api.js';

const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');
const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');
const avatarPopup = document.querySelector('.popup_type_avatar');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileFormElement = document.querySelector('.popup__form[name="edit-profile"]');
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const cardFormElement = document.querySelector('.popup__form[name="new-place"]');
const cardNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardFormElement.querySelector('.popup__input_type_url');

const avatarFormElement = document.querySelector('.popup__form[name="update-avatar"]');
const avatarLinkInput = avatarFormElement.querySelector('.popup__input_type_avatar-url');

const avatarEditButton = document.querySelector('.profile__image-overlay');
const profileAvatar = document.querySelector('.profile__image');

const placesList = document.querySelector('.places__list');
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');

function openModal(popup) {
  popup.classList.add('popup_is-opened');
}
function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
}
function clearForm(form) {
  form.reset();
}

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

function renderInitialCards() {
  getInitialCards()
    .then((cards) => {
      cards.forEach((card) => {
        const cardElement = createCard(card);
        placesList.append(cardElement);
      });
    })
    .catch((err) => console.error(err));
}

getInitialUserData()
  .then((user) => {
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
    profileAvatar.src = user.avatar;
    localStorage.setItem('userId', user._id);
  })
  .catch((err) => console.error(err));

document.querySelectorAll('.popup__close').forEach((button) => {
  const popup = button.closest('.popup');
  button.addEventListener('click', () => closeModal(popup));
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
});

document.querySelectorAll('.popup').forEach((popup) => {
  popup.addEventListener('click', (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
});

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(profilePopup);
});

profileFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  updateProfileDataRequest(nameInput.value, jobInput.value)
    .then((user) => {
      profileName.textContent = user.name;
      profileDescription.textContent = user.about;
      closeModal(profilePopup);
    })
    .catch((err) => console.error(err));
});

document.querySelector('.profile__add-button').addEventListener('click', () => {
  clearForm(cardFormElement);
  openModal(cardPopup);
});

cardFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newCard = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  createNewCardRequest(newCard.name, newCard.link, localStorage.getItem('userId'))
    .then((card) => {
      placesList.prepend(createCard(card));
      closeModal(cardPopup);
    })
    .catch((err) => console.error(err));
});

avatarEditButton.addEventListener('click', () => {
  clearForm(avatarFormElement);
  openModal(avatarPopup);
});

avatarFormElement.addEventListener('submit', (evt) => {
  evt.preventDefault();
  updateProfileAvatarRequest(avatarLinkInput.value)
    .then((res) => {
      profileAvatar.src = res.avatar;
      closeModal(avatarPopup);
    })
    .catch((err) => console.error(err));
});

renderInitialCards();
