document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'maple-simple-state-v1';

  const defaultState = {
    maples: [
      {
        id: 1,
        title: 'Maple Gold Leaf #001',
        cover: 'thumb-1',
        focus: 'Grounding',
        ownedByUser: false,
        ownerHasMinted: true,
        listed: true,
        price: 1.15,
        stories: [
          {
            owner: 'Amina',
            text: 'I mapped the forest trail with my breath. Four steps inhale, four steps exhale. Each tree reminded me I had made it back before.',
            timestamp: '2023-12-12T08:12:00Z',
          },
          {
            owner: 'Mira',
            text: 'Walking barefoot in the forest and naming every feeling out loud shrank my anxiety. The trees didn’t fix anything—they just held space until I remembered I belonged.',
            timestamp: '2024-02-11T09:12:00Z',
          },
        ],
      },
      {
        id: 2,
        title: 'Maple Gold Leaf #002',
        cover: 'thumb-2',
        focus: 'Community',
        ownedByUser: false,
        ownerHasMinted: true,
        listed: true,
        price: 1.08,
        stories: [
          {
            owner: 'Rafa',
            text: 'We light a small fire in a metal bowl and take turns sharing. Nobody responds, we just add wood to say “I heard you.”',
            timestamp: '2023-11-22T20:00:00Z',
          },
          {
            owner: 'Jonas',
            text: 'That fire circle helped me release the weight of feeling unseen. Dropping a stick into the flames became my way of letting go.',
            timestamp: '2024-01-25T19:45:00Z',
          },
        ],
      },
      {
        id: 3,
        title: 'Maple Gold Leaf #003',
        cover: 'thumb-3',
        focus: 'Rituals',
        ownedByUser: false,
        ownerHasMinted: true,
        listed: true,
        price: 1.12,
        stories: [
          {
            owner: 'Linh',
            text: 'I recorded a 40-second hum and loop it while matching the vibration with my palm on my chest. It’s my nightly reset.',
            timestamp: '2023-12-02T23:00:00Z',
          },
          {
            owner: 'Aya',
            text: 'Humming before bed gave my emotions a place to move. No words, just vibration, until my nervous system understood it could soften.',
            timestamp: '2023-12-30T22:48:00Z',
          },
        ],
      },
      {
        id: 12,
        title: 'Maple Gold Leaf #012',
        cover: 'thumb-4',
        focus: 'Reflection',
        ownedByUser: true,
        ownerHasMinted: false,
        listed: false,
        price: 1.05,
        stories: [
          {
            owner: 'Noor',
            text: 'At sunrise I write letters to the version of me three months ahead. When I open them, I can point to evidence that I kept going.',
            timestamp: '2023-12-18T06:10:00Z',
          },
        ],
      },
      {
        id: 18,
        title: 'Maple Gold Leaf #018',
        cover: 'thumb-5',
        focus: 'Embodiment',
        ownedByUser: true,
        ownerHasMinted: true,
        listed: false,
        price: 0.92,
        stories: [
          {
            owner: 'Kai',
            text: 'Before big meetings I shake my hands loose for a full minute, then breathe five counts in and seven out until my pulse slows.',
            timestamp: '2024-01-18T07:10:00Z',
          },
          {
            owner: 'You',
            text: 'Three rounds of box breathing paired with a gentle half sun-salutation keeps me from spiralling. Motion keeps rumination from looping.',
            timestamp: '2024-03-08T07:40:00Z',
          },
        ],
      },
      {
        id: 27,
        title: 'Maple Gold Leaf #027',
        cover: 'thumb-6',
        focus: 'Support',
        ownedByUser: true,
        ownerHasMinted: false,
        listed: true,
        price: 1.02,
        stories: [
          {
            owner: 'Sami',
            text: 'My sister and I have a 10-minute check-in every Thursday. Cameras on, no multitasking. Asking for support became as normal as brushing my teeth.',
            timestamp: '2024-01-26T18:00:00Z',
          },
        ],
      },
    ],
  };

  const state = loadState();

  setupCommonInteractions();

  if (document.body.classList.contains('marketplace-page')) {
    initMarketplace();
  }

  if (document.body.classList.contains('mint-page')) {
    initMint();
  }

  if (document.body.classList.contains('collection-page')) {
    initCollection();
  }

  function setupCommonInteractions() {
    const yearEl = document.querySelector('#current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    document.querySelectorAll('.connect-wallet').forEach((button) => {
      button.addEventListener('click', () => {
        alert('Wallet connection is coming soon. We’ll plug Maple Mental Movement into your wallet in the next release.');
      });
    });

    highlightActiveNav();

    const hero = document.querySelector('#hero');
    if (hero) {
      const exploreButton = hero.querySelector('.hero-actions .primary-btn');
      const learnButton = hero.querySelector('.hero-actions .secondary-btn');
      if (exploreButton) {
        exploreButton.addEventListener('click', () => {
          document.querySelector('#marketplace')?.scrollIntoView({ behavior: 'smooth' });
        });
      }
      if (learnButton) {
        learnButton.addEventListener('click', () => {
          document.querySelector('#learn')?.scrollIntoView({ behavior: 'smooth' });
        });
      }

      const detailButtons = hero.querySelectorAll('#marketplace .ghost-btn');
      detailButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const card = button.closest('.nft-card');
          const title = card?.querySelector('h3')?.textContent ?? 'This practice';
          alert(`${title} will have more details once the smart contracts are connected.`);
        });
      });
    }
  }

  function initMarketplace() {
    const grid = document.querySelector('[data-role="market-grid"]');
    const emptyState = document.querySelector('[data-role="market-empty"]');
    const searchInput = document.querySelector('[data-role="market-search"]');
    const listButton = document.querySelector('[data-role="open-listing"]');

    if (!grid) {
      return;
    }

    const render = () => {
      grid.innerHTML = '';
      const query = (searchInput?.value ?? '').trim().toLowerCase();

      const maples = state.maples.filter((maple) => maple.listed || maple.ownedByUser);

      const filtered = maples.filter((maple) => {
        if (!query) return true;
        const haystack = [
          maple.title,
          maple.focus,
          ...maple.stories.map((story) => story.text),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(query);
      });

      if (emptyState) {
        emptyState.hidden = filtered.length > 0;
      }

      filtered.forEach((maple) => {
        grid.appendChild(createMarketplaceCard(maple));
      });
    };

    grid.addEventListener('click', (event) => {
      const historyButton = event.target.closest('[data-action="history"]');
      if (historyButton) {
        const id = Number(historyButton.dataset.id);
        const maple = findMaple(id);
        if (maple) {
          showStoryHistory(maple);
        }
        return;
      }

      const listButtonEl = event.target.closest('[data-action="list"]');
      if (listButtonEl) {
        const id = Number(listButtonEl.dataset.id);
        openListingFlow(id);
        render();
        return;
      }

      const unlistButtonEl = event.target.closest('[data-action="unlist"]');
      if (unlistButtonEl) {
        const id = Number(unlistButtonEl.dataset.id);
        const maple = findMaple(id);
        if (maple && maple.ownedByUser) {
          maple.listed = false;
          saveState();
          alert(`${maple.title} has been removed from the marketplace for now.`);
          render();
        }
        return;
      }

      const buyButton = event.target.closest('[data-action="buy"]');
      if (buyButton) {
        const id = Number(buyButton.dataset.id);
        const maple = findMaple(id);
        if (maple) {
          alert(`Purchasing ${maple.title} will be available once the smart contracts go live.`);
        }
      }
    });

    if (searchInput) {
      searchInput.addEventListener('input', render);
    }

    if (listButton) {
      listButton.addEventListener('click', () => {
        const firstOwned = state.maples.find((maple) => maple.ownedByUser);
        if (!firstOwned) {
          alert('Connect a wallet with Maple Gold Leafs to list them.');
          return;
        }
        openListingFlow(firstOwned.id);
        render();
      });
    }

    render();
  }

  function highlightActiveNav() {
    const navLinks = document.querySelectorAll('.site-nav a[data-page]');
    if (!navLinks.length) {
      return;
    }

    const page = document.body.dataset.page;
    navLinks.forEach((link) => {
      const { page: linkPage } = link.dataset;
      if (page && linkPage === page) {
        link.classList.add('is-active');
      }
    });
  }

  function initMint() {
    const grid = document.querySelector('[data-role="mint-grid"]');
    const form = document.querySelector('[data-role="mint-form"]');
    const select = document.querySelector('[data-role="mint-select"]');
    const textarea = form?.querySelector('[data-role="mint-story"]');
    const countEl = form?.querySelector('[data-role="mint-count"]');
    const previewButton = form?.querySelector('[data-role="preview-story"]');
    const historyContainer = document.querySelector('[data-role="mint-history"]');

    if (!grid || !form || !select || !textarea || !countEl || !previewButton || !historyContainer) {
      return;
    }

    let selectedMapleId = null;

    const renderGrid = () => {
      grid.innerHTML = '';
      const owned = state.maples.filter((maple) => maple.ownedByUser);

      if (!owned.length) {
        grid.innerHTML =
          '<p class="marketplace-empty-state">Connect a wallet to start minting your stories.</p>';
      }

      owned.forEach((maple) => {
        grid.appendChild(createOwnedCard(maple));
      });
    };

    const renderSelect = () => {
      select.innerHTML = '<option value="">Choose a Maple to mint</option>';
      state.maples
        .filter((maple) => maple.ownedByUser)
        .forEach((maple) => {
          const option = document.createElement('option');
          option.value = String(maple.id);
          const status = maple.ownerHasMinted ? 'story minted' : 'needs story';
          option.textContent = `${formatMapleLabel(maple)} · ${status}`;
          option.disabled = maple.ownerHasMinted;
          select.appendChild(option);
        });
    };

    const renderHistory = (maple) => {
      historyContainer.innerHTML = '';

      if (!maple) {
        const empty = document.createElement('p');
        empty.className = 'info-note';
        empty.textContent = 'Choose a Maple to read the stories already recorded.';
        historyContainer.appendChild(empty);
        return;
      }

      const heading = document.createElement('h4');
      heading.textContent = 'Previous stories';
      historyContainer.appendChild(heading);

      maple.stories
        .slice()
        .reverse()
        .forEach((story) => {
          const entry = document.createElement('article');

          const keeper = document.createElement('strong');
          keeper.textContent = story.owner;
          entry.appendChild(keeper);

          const body = document.createElement('p');
          body.textContent = story.text;
          entry.appendChild(body);

          const timestamp = document.createElement('time');
          timestamp.dateTime = story.timestamp ?? '';
          timestamp.textContent = formatDate(story.timestamp);
          entry.appendChild(timestamp);

          historyContainer.appendChild(entry);
        });
    };

    grid.addEventListener('click', (event) => {
      const historyButton = event.target.closest('[data-action="history"]');
      if (historyButton) {
        const id = Number(historyButton.dataset.id);
        const maple = findMaple(id);
        if (maple) {
          showStoryHistory(maple);
          renderHistory(maple);
        }
        return;
      }

      const writeButton = event.target.closest('[data-action="write"]');
      if (writeButton) {
        const id = Number(writeButton.dataset.id);
        selectedMapleId = id;
        select.value = String(id);
        textarea.focus();
        updateWordCount();
        renderHistory(getSelectedMaple());
      }
    });

    select.addEventListener('change', () => {
      const id = Number(select.value);
      selectedMapleId = Number.isNaN(id) ? null : id;
      renderHistory(getSelectedMaple());
      updateWordCount();
    });

    textarea.addEventListener('input', updateWordCount);

    previewButton.addEventListener('click', (event) => {
      event.preventDefault();
      const maple = getSelectedMaple();
      if (!maple) {
        alert('Choose a Maple before previewing your story.');
        return;
      }
      const storyText = textarea.value.trim();
      if (!storyText) {
        alert('Write your story first.');
        return;
      }
      const words = countWords(storyText);
      if (words > 200) {
        alert('Stories must stay within 200 words. Please edit your entry.');
        return;
      }
      alert(`Preview for ${maple.title}:\n\n${storyText}`);
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const maple = getSelectedMaple();
      if (!maple) {
        alert('Choose a Maple before minting your story.');
        return;
      }
      if (maple.ownerHasMinted) {
        alert('You have already minted your chapter for this Maple.');
        return;
      }
      const storyText = textarea.value.trim();
      if (!storyText) {
        alert('Write your story before minting.');
        return;
      }
      const words = countWords(storyText);
      if (words > 200) {
        alert('Your story is over 200 words. Please shorten it before minting.');
        return;
      }

      const confirmMint = confirm(
        'Once you confirm, your story will be stored on IPFS and anchored to the Maple contract. You will not be able to edit it. Continue?',
      );

      if (!confirmMint) {
        return;
      }

      maple.ownerHasMinted = true;
      maple.stories.push({
        owner: 'You',
        text: storyText,
        timestamp: new Date().toISOString(),
      });

      saveState();
      textarea.value = '';
      selectedMapleId = null;
      select.value = '';
      updateWordCount();
      renderGrid();
      renderSelect();
      renderHistory(null);

      alert('Your story has been minted to decentralized storage. Thank you for adding to the Maple chain.');
    });

    renderGrid();
    renderSelect();
    renderHistory(null);
    updateWordCount();

    function getSelectedMaple() {
      if (!selectedMapleId) {
        return null;
      }
      return findMaple(selectedMapleId);
    }

    function updateWordCount() {
      const words = countWords(textarea.value);
      countEl.textContent = `${words} / 200 words`;
      if (words > 200) {
        countEl.classList.add('is-alert');
      } else {
        countEl.classList.remove('is-alert');
      }
    }
  }

  function initCollection() {
    const grid = document.querySelector('[data-role="collection-grid"]');
    const emptyState = document.querySelector('[data-role="collection-empty"]');

    if (!grid) {
      return;
    }

    const render = () => {
      grid.innerHTML = '';
      const owned = state.maples.filter((maple) => maple.ownedByUser);

      if (emptyState) {
        emptyState.hidden = owned.length > 0;
      }

      owned.forEach((maple) => {
        grid.appendChild(createCollectionCard(maple));
      });
    };

    grid.addEventListener('click', (event) => {
      const historyButton = event.target.closest('[data-action="history"]');
      if (historyButton) {
        const id = Number(historyButton.dataset.id);
        const maple = findMaple(id);
        if (maple) {
          showStoryHistory(maple);
        }
        return;
      }

      const mintButton = event.target.closest('[data-action="go-mint"]');
      if (mintButton) {
        window.location.href = 'mint.html';
        return;
      }

      const listButton = event.target.closest('[data-action="list"]');
      if (listButton) {
        const id = Number(listButton.dataset.id);
        openListingFlow(id);
        render();
        return;
      }

      const unlistButton = event.target.closest('[data-action="unlist"]');
      if (unlistButton) {
        const id = Number(unlistButton.dataset.id);
        const maple = findMaple(id);
        if (maple && maple.ownedByUser) {
          maple.listed = false;
          saveState();
          alert(`${maple.title} has been removed from the marketplace for now.`);
          render();
        }
      }
    });

    render();
  }

  function createMarketplaceCard(maple) {
    const card = document.createElement('article');
    card.className = 'nft-card';

    const thumb = document.createElement('div');
    thumb.className = `nft-thumb ${maple.cover}`;
    card.appendChild(thumb);

    const info = document.createElement('div');
    info.className = 'nft-info';

    const title = document.createElement('h3');
    title.textContent = formatMapleLabel(maple);
    info.appendChild(title);

    const story = document.createElement('p');
    story.textContent = summarise(maple.stories[maple.stories.length - 1]?.text ?? '');
    info.appendChild(story);

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const viewHistory = document.createElement('button');
    viewHistory.className = 'ghost-btn';
    viewHistory.type = 'button';
    viewHistory.dataset.action = 'history';
    viewHistory.dataset.id = maple.id;
    viewHistory.textContent = 'View history';
    actions.appendChild(viewHistory);

    if (maple.ownedByUser) {
      const listBtn = document.createElement('button');
      listBtn.className = 'primary-btn';
      listBtn.type = 'button';
      listBtn.dataset.action = 'list';
      listBtn.dataset.id = maple.id;
      listBtn.textContent = maple.listed ? 'Update listing' : 'List Maple';
      actions.appendChild(listBtn);

      if (maple.listed) {
        const unlistBtn = document.createElement('button');
        unlistBtn.className = 'secondary-btn';
        unlistBtn.type = 'button';
        unlistBtn.dataset.action = 'unlist';
        unlistBtn.dataset.id = maple.id;
        unlistBtn.textContent = 'Remove listing';
        actions.appendChild(unlistBtn);
      }
    } else {
      const priceTag = document.createElement('span');
      priceTag.className = 'price';
      priceTag.textContent = `Price: ${formatPrice(maple.price)} ETH`;
      info.appendChild(priceTag);

      const buyBtn = document.createElement('button');
      buyBtn.className = 'primary-btn';
      buyBtn.type = 'button';
      buyBtn.dataset.action = 'buy';
      buyBtn.dataset.id = maple.id;
      buyBtn.textContent = 'Purchase';
      actions.appendChild(buyBtn);
    }

    info.appendChild(actions);
    card.appendChild(info);
    return card;
  }

  function createOwnedCard(maple) {
    const card = document.createElement('article');
    card.className = 'nft-card';

    const thumb = document.createElement('div');
    thumb.className = `nft-thumb ${maple.cover}`;
    card.appendChild(thumb);

    const info = document.createElement('div');
    info.className = 'nft-info';

    if (maple.listed) {
      const listingNote = document.createElement('span');
      listingNote.className = 'status-pill';
      listingNote.textContent = `Listed · ${formatPrice(maple.price)} ETH`;
      info.appendChild(listingNote);
    }

    const title = document.createElement('h3');
    title.textContent = formatMapleLabel(maple);
    info.appendChild(title);

    const story = document.createElement('p');
    story.textContent = summarise(maple.stories[maple.stories.length - 1]?.text ?? '');
    info.appendChild(story);

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const historyBtn = document.createElement('button');
    historyBtn.className = 'ghost-btn';
    historyBtn.type = 'button';
    historyBtn.dataset.action = 'history';
    historyBtn.dataset.id = maple.id;
    historyBtn.textContent = 'View history';
    actions.appendChild(historyBtn);

    if (!maple.ownerHasMinted) {
      const writeBtn = document.createElement('button');
      writeBtn.className = 'primary-btn';
      writeBtn.type = 'button';
      writeBtn.dataset.action = 'write';
      writeBtn.dataset.id = maple.id;
      writeBtn.textContent = 'Mint my story';
      actions.appendChild(writeBtn);
    }

    if (maple.listed) {
      const listingNote = document.createElement('p');
      listingNote.className = 'info-note';
      listingNote.textContent = `Currently listed for ${formatPrice(maple.price)} ETH`;
      info.appendChild(listingNote);
    }

    info.appendChild(actions);
    card.appendChild(info);
    return card;
  }

  function createCollectionCard(maple) {
    const card = document.createElement('article');
    card.className = 'nft-card';

    const thumb = document.createElement('div');
    thumb.className = `nft-thumb ${maple.cover}`;
    card.appendChild(thumb);

    const info = document.createElement('div');
    info.className = 'nft-info';

    if (maple.listed) {
      const listingNote = document.createElement('span');
      listingNote.className = 'status-pill';
      listingNote.textContent = `Listed · ${formatPrice(maple.price)} ETH`;
      info.appendChild(listingNote);
    }

    const title = document.createElement('h3');
    title.textContent = formatMapleLabel(maple);
    info.appendChild(title);

    const story = document.createElement('p');
    story.textContent = summarise(maple.stories[maple.stories.length - 1]?.text ?? '');
    info.appendChild(story);

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const historyBtn = document.createElement('button');
    historyBtn.className = 'ghost-btn';
    historyBtn.type = 'button';
    historyBtn.dataset.action = 'history';
    historyBtn.dataset.id = maple.id;
    historyBtn.textContent = 'View history';
    actions.appendChild(historyBtn);

    if (!maple.ownerHasMinted) {
      const mintBtn = document.createElement('button');
      mintBtn.className = 'primary-btn';
      mintBtn.type = 'button';
      mintBtn.dataset.action = 'go-mint';
      mintBtn.textContent = 'Mint my story';
      actions.appendChild(mintBtn);
    }

    const listBtn = document.createElement('button');
    listBtn.className = 'secondary-btn';
    listBtn.type = 'button';
    listBtn.dataset.action = 'list';
    listBtn.dataset.id = maple.id;
    listBtn.textContent = maple.listed ? 'Update listing' : 'List Maple';
    actions.appendChild(listBtn);

    if (maple.listed) {
      const unlistBtn = document.createElement('button');
      unlistBtn.className = 'ghost-btn';
      unlistBtn.type = 'button';
      unlistBtn.dataset.action = 'unlist';
      unlistBtn.dataset.id = maple.id;
      unlistBtn.textContent = 'Remove listing';
      actions.appendChild(unlistBtn);
    }

    info.appendChild(actions);
    card.appendChild(info);
    return card;
  }

  function openListingFlow(mapleId) {
    const maple = findMaple(mapleId);
    if (!maple || !maple.ownedByUser) {
      alert('You can only list Maples you currently own.');
      return;
    }

    if (!maple.ownerHasMinted) {
      const goMint = confirm(
        `${maple.title} does not have your story yet. Would you like to visit the minting page first?`,
      );
      if (goMint) {
        window.location.href = 'mint.html';
        return;
      }
    }

    const currentPrice = maple.price ? String(maple.price) : '1.00';
    const priceInput = prompt(
      `Set the listing price in ETH for ${maple.title}:`,
      currentPrice,
    );

    if (!priceInput) {
      return;
    }

    const priceValue = Number(priceInput);
    if (Number.isNaN(priceValue) || priceValue <= 0) {
      alert('Enter a valid price greater than zero.');
      return;
    }

    maple.price = Number(priceValue.toFixed(2));
    maple.listed = true;
    saveState();
    alert(`${maple.title} is now listed for ${formatPrice(maple.price)} ETH.`);
  }

  function findMaple(id) {
    return state.maples.find((maple) => maple.id === id);
  }

  function showStoryHistory(maple) {
    const existing = document.querySelector('.modal-overlay');
    if (existing) {
      existing.remove();
    }

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modalCard = document.createElement('div');
    modalCard.className = 'modal-card';
    overlay.appendChild(modalCard);

    const logo = document.createElement('img');
    logo.src = 'Logo-icon.png';
    logo.alt = 'Maple Gold Leaf';
    logo.style.width = '64px';
    logo.style.alignSelf = 'center';
    modalCard.appendChild(logo);

    const header = document.createElement('header');
    const title = document.createElement('h2');
    title.textContent = formatMapleLabel(maple);
    header.appendChild(title);

    modalCard.appendChild(header);

    const historyList = document.createElement('div');
    historyList.className = 'story-history';

    maple.stories
      .slice()
      .reverse()
      .forEach((story, index) => {
        const entry = document.createElement('article');

        const keeper = document.createElement('h3');
        keeper.textContent = story.owner;
        entry.appendChild(keeper);

        const body = document.createElement('p');
        body.textContent = story.text;
        entry.appendChild(body);

        const timestamp = document.createElement('time');
        timestamp.dateTime = story.timestamp ?? '';
        timestamp.textContent = formatDate(story.timestamp);
        entry.appendChild(timestamp);

        historyList.appendChild(entry);
      });

    modalCard.appendChild(historyList);

    const closeOverlay = () => {
      overlay.remove();
      document.removeEventListener('keydown', escListener);
    };

    const escListener = (event) => {
      if (event.key === 'Escape') {
        closeOverlay();
      }
    };

    document.addEventListener('keydown', escListener);

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeOverlay();
      }
    });

    modalCard.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    document.body.appendChild(overlay);
  }

  function summarise(text) {
    const trimmed = text.trim();
    if (trimmed.length <= 180) {
      return trimmed;
    }
    const snippet = trimmed.slice(0, 177);
    const lastSpace = snippet.lastIndexOf(' ');
    return `${snippet.slice(0, lastSpace)}…`;
  }

  function formatMapleLabel(maple) {
    const number = String(maple.id).padStart(2, '0');
    return `Maple Gold Leaf ${number} / 66`;
  }

  function formatPrice(price) {
    if (price === undefined || price === null) {
      return '0.00';
    }
    return Number(price).toFixed(2);
  }

  function formatDate(value) {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function countWords(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return 0;
    }
    return trimmed.split(/\s+/).length;
  }

  function loadState() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return cloneDefaultState();
      }
      const parsed = JSON.parse(raw);
      if (!parsed?.maples) {
        return cloneDefaultState();
      }
      return parsed;
    } catch (error) {
      return cloneDefaultState();
    }
  }

  function saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // Ignore persistence issues in this static build.
    }
  }

  function cloneDefaultState() {
    return JSON.parse(JSON.stringify(defaultState));
  }
});
