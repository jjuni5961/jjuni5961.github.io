(() => {
  const pages = Array.from(document.querySelectorAll('.menu-page'));
  const chapterPills = Array.from(document.querySelectorAll('.chapter-pill'));
  const tocButtons = Array.from(document.querySelectorAll('.toc-item'));
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  const bottomPrevBtn = document.getElementById('bottomPrevBtn');
  const bottomNextBtn = document.getElementById('bottomNextBtn');
  const pageCounter = document.getElementById('pageCounter');
  const bottomCounter = document.getElementById('bottomCounter');
  const toggleViewBtn = document.getElementById('toggleViewBtn');
  const printBtn = document.getElementById('printBtn');

  let currentPage = 0;
  let isViewAll = false;

  function pad(num) {
    return String(num).padStart(2, '0');
  }

  function updateUI(scrollTop = false) {
    pages.forEach((page, idx) => {
      page.classList.toggle('is-visible', idx === currentPage);
    });

    chapterPills.forEach((pill, idx) => {
      pill.classList.toggle('is-current', idx === currentPage);
      if (idx === currentPage && !isViewAll) {
        pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    const label = `PAGE ${pad(currentPage + 1)} / ${pad(pages.length)}`;
    pageCounter.textContent = label;
    if (bottomCounter) bottomCounter.textContent = label;

    const atStart = currentPage === 0;
    const atEnd = currentPage === pages.length - 1;
    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
    if (bottomPrevBtn) bottomPrevBtn.disabled = atStart;
    if (bottomNextBtn) bottomNextBtn.disabled = atEnd;

    if (scrollTop && !isViewAll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function goToPage(index, scrollTop = true) {
    if (index < 0 || index >= pages.length) return;
    currentPage = index;

    if (isViewAll) {
      updateUI(false);
      pages[currentPage].scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      updateUI(scrollTop);
    }
  }

  prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
  if (bottomPrevBtn) bottomPrevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  if (bottomNextBtn) bottomNextBtn.addEventListener('click', () => goToPage(currentPage + 1));

  chapterPills.forEach((pill, idx) => {
    pill.addEventListener('click', () => goToPage(idx));
  });

  tocButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = Number(btn.dataset.targetPage || 0);
      goToPage(target);
    });
  });

  toggleViewBtn.addEventListener('click', () => {
    isViewAll = !isViewAll;
    document.body.classList.toggle('view-all', isViewAll);
    toggleViewBtn.classList.toggle('is-active', isViewAll);
    toggleViewBtn.textContent = isViewAll ? '한 페이지씩 넘겨보기' : '전체 페이지 펼쳐보기';
    updateUI(false);
  });

  printBtn.addEventListener('click', () => {
    window.print();
  });

  document.addEventListener('keydown', (e) => {
    if (isViewAll) return;
    if (e.key === 'ArrowRight') goToPage(currentPage + 1);
    if (e.key === 'ArrowLeft') goToPage(currentPage - 1);
  });

  updateUI(false);
})();
