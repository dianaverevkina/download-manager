import links from './links';

export default class Widget {
  constructor(container) {
    this.container = document.querySelector(container);

    this.filesWrapper = this.container.querySelector('.downloader__wrapper');
    this.downloadedMb = this.container.querySelector('.widget__Mb');
    this.mBNumber = 0;

    this.calcDownloadedMb = this.calcDownloadedMb.bind(this);
  }

  // Отрисовываем HTML элемента файла
  createFileElement({ link, name, size }) {
    const file = document.createElement('div');
    file.classList.add('downloader__row', 'file');
    file.innerHTML = `
      <p class="file__col file__name">${name.replace(/\.pdf$/, '')}</p>
      <p class="file__col file__size">${size}</p>
      <a href="${link}" class="file__col file__link" download="${name}" rel="noopener">Download</a>
    `;

    this.link = file.querySelector('.file__link');
    this.link.addEventListener('click', this.calcDownloadedMb);

    this.filesWrapper.append(file);
  }

  // Загружаем файлы
  loadFiles() {
    links.forEach((link) => {
      this.createFileElement(link);
    });
  }

  // Подсчитываем количесвто скачанных мегабайт
  calcDownloadedMb(e) {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const downloadedBytes = event.loaded;
        const downloadedMB = +((downloadedBytes / (1024 * 1024)).toFixed(2));
        this.mBNumber += downloadedMB;
        this.downloadedMb.textContent = this.mBNumber;
      }
    });

    xhr.open('GET', e.target.href);
    xhr.send();
  }
}
