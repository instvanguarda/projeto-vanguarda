// DOM Manipulation Helpers
// DOM Manipulation Helpers
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

document.addEventListener('DOMContentLoaded', () => {

    // Right side section navigation bar.
    const rightSideNav = $('.right-side-nav'); // top parent
    const allIndicators = $$('.right-side-nav ul a'); // all children (nav buttons)
    const sectionIndicator = $('.section-indicator'); // indicator inside the bar.

    // Function for right side nav bar - appear / disapper (timeout funtion included)
    const rightSideNavOpacityTimeout = (() => {
        let _opacity = 1;
        let timer;
        return {
            get opacity() {
                return _opacity;
            },
            set opacity(number) {
                _opacity: number;
                if (number === 1) {
                    rightSideNav.classList.remove('opacity-0');
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        _opacity = 0
                        rightSideNav.classList.add('opacity-0');
                    }, 1700);
                }
            }
        }
    })()
    rightSideNavOpacityTimeout.opacity = 1 // To disapper the right side nav bar after rendered.
    // To apper / disapper the right side nav bar (onhover / onhover out) 
    rightSideNav.addEventListener('mouseenter', () => {
        rightSideNavOpacityTimeout.opacity = 1
    })
    rightSideNav.addEventListener('mouseleave', () => {
        rightSideNavOpacityTimeout.opacity = 0
    })
    // Same on touch
    rightSideNav.addEventListener('touchstart', () => {
        rightSideNavOpacityTimeout.opacity = 1
    }, { passive: true })
    rightSideNav.addEventListener('touchend', () => {
        rightSideNavOpacityTimeout.opacity = 0
    }, { passive: true })

    // Background images
    const image1Cloud = $('.image1-cloud');
    const image2Mountains = $('.image2-mountains');
    const image3PersonOnMountain = $('.image3-person-on-mountain');

    const bgLayer3BlackWhite = $('.bg-layer3-black-white');

    const heroSectionViewPlaceholder = $('.hero-section-view-placeholder');
    const heroSection = $('.hero-section');
    const containerInfoCards = $('.container-info-cards');
    const navUserAccountBox = $('.userAccount a');

    const thresholds = Array.from({ length: 101 }, (_, i) => i / 100); // 0,0.01,0.02,..., 0.99, 1 // For observers.

    // Observer for all background images animation - slight position changing while scrolling.
    const observerReducerAllBackgroundImages = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            const ratio = entry.intersectionRatio; // 0〜1
            const top = entry.boundingClientRect.top;
            if (ratio > 0.6) {
                sectionIndicator.style.transform = `translateY(${0}00%)`; // To scroll the right side navbar indicator.
                rightSideNavOpacityTimeout.opacity = 1; // To disapper the right side navbar.
            }
            const slide = 150 * (1 - Math.max(0, Math.min(1, ratio))); // 可視率が低いほど数値↑（0→50）
            const slide2 = 50 * (1 - Math.max(0, Math.min(1, ratio)));
            const slide3 = 20 * (1 - Math.max(0, Math.min(1, ratio)));
            entry.target.style.transform = `translateY(-${slide}px)`; // 0→-50px
            image2Mountains.style.transform = `translateY(-${slide2}px)`; // 0→-50px
            bgLayer3BlackWhite.style.transform = `translateY(-${slide2}px)`; // 0→-50px
            image3PersonOnMountain.style.transform = `translateY(${slide3}px)`; // 0→-50px

        })
    }, {
        threshold: thresholds
    });

    // Observer for hero section opacity animation.
    const observerReducerheroSectionOpacity = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            const ratio = entry.intersectionRatio;
            heroSection.style.opacity = ratio;
        })
    }, {
        threshold: thresholds
    });

    // Adding observers on background images, hero section for animation / transition.
    observerReducerAllBackgroundImages.observe(image1Cloud);
    observerReducerheroSectionOpacity.observe(heroSectionViewPlaceholder);

    // To create info card using template element.
    function createInfoCard(index, subtitle, title, description, image) {
        const template = $('.info-card-template');
        const clone = template.content.cloneNode(true);

        const clone$ = (selector) => clone.querySelector(selector);

        clone$('.info-serial-no').innerText = String(index).padStart(2, '0');
        clone$('.subtitle .subtitle-text').innerText = subtitle;
        clone$('.title').innerText = title;
        clone$('.description').innerText = description;
        const img = clone$('.info-image');
        img.src = image;
        img.loading = "lazy";
        clone$('.info-card').id = `info-card-${index}`;

        if (index % 2 === 0) {
            clone$('.info-card').classList.add('info-card-flex-row-reverse');
            clone$('.info-serial-no').classList.add('info-serial-no-even');
            clone$('.half-box-text').classList.add('half-box-text-even');
            clone$('.half-box-image').classList.add('half-box-image-even');
        }

        return clone;
    };

    // For image loading.
    function loadImage(src) {
        return new Promise((resolve) => {
            const img = new Image;
            img.onload = () => resolve(src);
            img.onerror = () => {
                console.warn(`Aviso: A imagem ${src} não foi encontrada ainda.`);
                resolve(src); // resolve mesmo com erro para não quebrar o resto do site
            };
            img.src = src;
        })
    };

    // To start creating info cards one by one.
    async function createInfoCards() {
        // loop through all card data
        for (let i = 0; i < collectionCardData.length; i++) {
            const data = collectionCardData[i];
            containerInfoCards.appendChild(
                createInfoCard(i + 1, data.subtitle, data.title, data.description, data.image)
            );
        };
        // -------------------------
        // Removed dynamic background height calculation
        // -------------------------

        const observerReducerCardImage = (entry, oddEven) => {
            const card = entry.target.closest('.info-card');
            const startDash = card ? card.querySelector('.start-dash') : null;
            const ratio = entry.intersectionRatio;
            const top = entry.boundingClientRect.top;
            if (ratio > 0.6) {
                const retriveIndex = card.querySelector(`.info-serial-no`).innerText;
                sectionIndicator.style.transform = `translateY(${retriveIndex}00%)`; // To scroll the right side navbar indicator.
                rightSideNavOpacityTimeout.opacity = 1; // To disapper the right side navbar.
            }
            // To stop the animation / transition of info card.
            if (top < 0) return;
            const slideAmount = 50 - ratio * 50;
            if (oddEven === 'odd') entry.target.style.transform = `translateX(${slideAmount}px)`;
            else entry.target.style.transform = `translateX(-${slideAmount}px)`;
            entry.target.style.opacity = 0.3 + ratio * 0.7;
            startDash.style.maxWidth = `${Math.min((72 * ((ratio * 100) + 30) / 100), 72)}px`
            // Start opacity at 0.3 (not completely invisible, just slightly faded)
            // Multiply ratio (0 → 1) by 0.7 → gives us a range 0 → 0.7
            // Add them together → gives final opacity range 0.3 → 1.0
        }

        // To observer odd card's image and add left-to-right slide-in transition.
        const observerReducerOddCardImage = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => observerReducerCardImage(entry, 'odd'))
        }, {
            threshold: thresholds // 0,0.01,0.02,..., 0.99, 1
        });

        // To observer even card's image and add right-to-left slide-in transition.
        const observerReducerEvenCardImage = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => observerReducerCardImage(entry, 'even'))
        }, { threshold: thresholds });

        // To observer card's title, description, read-more button and add bottom-to-up slide-up transition.
        const observerReducerSlide20pxUp = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                const ratio = entry.intersectionRatio;
                const top = entry.boundingClientRect.top;
                if (top < 0) {
                    return;
                }
                const slideAmount = 20 - (20 * ratio);
                entry.target.style.transform = `translateY(${slideAmount}px)`;
            })
        }, {
            threshold: thresholds
        });

        // After cards appended in the DOM.
        const infoCardImages = $$('.info-image'); // Accessing all card images
        const infoCardTitles = $$('.info-card .title'); // Accessing card's title.
        const infoCardDescription = $$('.info-card .description'); // Accessing card's description.

        // Adding observers for smooth animations (After appending all info card)
        infoCardImages.forEach((img, index) => {
            if ((index + 1) % 2 === 0) {
                observerReducerEvenCardImage.observe(img);
            } else {
                observerReducerOddCardImage.observe(img);
            }
        });
        infoCardTitles.forEach((title) => {
            observerReducerSlide20pxUp.observe(title);
        });
        infoCardDescription.forEach((description) => {
            observerReducerSlide20pxUp.observe(description);
        });
    }

    createInfoCards(); // Start appending all cards one-by-one and, will also add observers.

    // Account button - hover effect handled by CSS or inline style now
    if (navUserAccountBox) {
        navUserAccountBox.addEventListener('mouseenter', () => {
            navUserAccountBox.style.backgroundColor = '#166534'; // darker green
        });
        navUserAccountBox.addEventListener('mouseleave', () => {
            navUserAccountBox.style.backgroundColor = '#15803d'; // normal green
        });
    }

    // Pix Donation Logic
    const pixValueBtns = $$('.pix-value-btn');
    const pixCustomValueContainer = $('#pix-custom-value-container');
    const pixCustomValueInput = $('#pix-custom-value');
    const btnGerarPix = $('#btn-gerar-pix');
    const pixStep1 = $('#pix-step-1');
    const pixStep2 = $('#pix-step-2');
    const btnCopyPix = $('#btn-copy-pix');
    const btnBackPix = $('#btn-back-pix');
    const pixCopySuccess = $('#pix-copy-success');

    let selectedPixValue = null;

    if (pixValueBtns.length > 0) {
        pixValueBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all
                pixValueBtns.forEach(b => b.classList.remove('active'));
                // Add active to clicked
                e.target.classList.add('active');
                
                const value = e.target.getAttribute('data-value');
                if (value === 'other') {
                    pixCustomValueContainer.style.display = 'block';
                    selectedPixValue = 'other';
                    pixCustomValueInput.focus();
                } else {
                    pixCustomValueContainer.style.display = 'none';
                    selectedPixValue = value;
                }
            });
        });

        // Input mask for currency
        if (pixCustomValueInput) {
            pixCustomValueInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value === "") {
                    e.target.value = "";
                    return;
                }
                value = (parseInt(value) / 100).toFixed(2) + "";
                value = value.replace(".", ",");
                value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
                e.target.value = "R$ " + value;
            });
        }

        if (btnGerarPix) {
            btnGerarPix.addEventListener('click', () => {
                let finalValue = 0;
                if (selectedPixValue === 'other') {
                    let rawVal = pixCustomValueInput.value.replace('R$ ', '').replace(/\./g, '').replace(',', '.');
                    finalValue = parseFloat(rawVal);
                } else if (selectedPixValue) {
                    finalValue = parseFloat(selectedPixValue);
                }

                if (!finalValue || finalValue <= 0) {
                    alert('Por favor, selecione ou digite um valor válido para apoiar o projeto.');
                    return;
                }

                // --- Gerador Dinâmico de Pix ---
                const pixKey = 'Inst.vanguarda2018@gmail.com';
                const merchantName = 'Instituto Vanguarda';
                const merchantCity = 'SALVADOR';
                
                function generatePixPayload(key, name, city, amount, referenceId = '***') {
                    name = name.substring(0, 25).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z0-9 ]/g, "");
                    city = city.substring(0, 15).toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z0-9 ]/g, "");
                    
                    let formattedKey = key.replace(/[^\w@.-]/g, '').toLowerCase();
                    if (/^\d{10,11}$/.test(formattedKey)) {
                        formattedKey = '+55' + formattedKey;
                    }

                    const payloadFormat = '000201';
                    const gui = 'br.gov.bcb.pix';
                    const merchantAccountInfo = `0014${gui}01${formattedKey.length.toString().padStart(2, '0')}${formattedKey}`;
                    const merchantAccountInfoLen = merchantAccountInfo.length.toString().padStart(2, '0');
                    const maiField = `26${merchantAccountInfoLen}${merchantAccountInfo}`;
                    const mcc = '52040000';
                    const currency = '5303986';
                    
                    const amountStr = Number(amount).toFixed(2);
                    const amountLen = amountStr.length.toString().padStart(2, '0');
                    const amountField = `54${amountLen}${amountStr}`;
                    
                    const country = '5802BR';
                    const nameLen = name.length.toString().padStart(2, '0');
                    const nameField = `59${nameLen}${name}`;
                    const cityLen = city.length.toString().padStart(2, '0');
                    const cityField = `60${cityLen}${city}`;
                    const refLen = referenceId.length.toString().padStart(2, '0');
                    const additionalData = `05${refLen}${referenceId}`;
                    const additionalDataLen = additionalData.length.toString().padStart(2, '0');
                    const additionalDataField = `62${additionalDataLen}${additionalData}`;
                    
                    const payload = `${payloadFormat}${maiField}${mcc}${currency}${amountField}${country}${nameField}${cityField}${additionalDataField}6304`;
                    
                    let crc = 0xFFFF;
                    for (let i = 0; i < payload.length; i++) {
                        crc ^= payload.charCodeAt(i) << 8;
                        for (let j = 0; j < 8; j++) {
                            if ((crc & 0x8000) !== 0) {
                                crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
                            } else {
                                crc = (crc << 1) & 0xFFFF;
                            }
                        }
                    }
                    const crcHex = crc.toString(16).toUpperCase().padStart(4, '0');
                    return payload + crcHex;
                }
                
                const pixCopiaECola = generatePixPayload(pixKey, merchantName, merchantCity, finalValue);
                
                // Exibir a chave no campo de cópia
                $('#pix-key-text').innerText = pixCopiaECola;
                
                // Gerar o QR Code visual
                const qrPlaceholder = $('.pix-qrcode-placeholder');
                qrPlaceholder.innerHTML = ''; // Limpar placeholder SVG original
                
                // Instanciar o QRCode (usando a lib qrcode.js que incluímos no HTML)
                if (typeof QRCode !== 'undefined') {
                    new QRCode(qrPlaceholder, {
                        text: pixCopiaECola,
                        width: 180,
                        height: 180,
                        colorDark : "#0b1d26",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.M
                    });
                } else {
                    qrPlaceholder.innerHTML = '<span style="color:#000;">[Erro ao carregar QR Code]</span>';
                }

                // Transition to Step 2
                pixStep1.style.display = 'none';
                pixStep2.style.display = 'block';
                pixCopySuccess.style.display = 'none';
            });
        }

        if (btnBackPix) {
            btnBackPix.addEventListener('click', () => {
                pixStep2.style.display = 'none';
                pixStep1.style.display = 'block';
            });
        }

        if (btnCopyPix) {
            btnCopyPix.addEventListener('click', () => {
                const textToCopy = $('#pix-key-text').innerText;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    pixCopySuccess.style.display = 'block';
                    setTimeout(() => {
                        pixCopySuccess.style.display = 'none';
                    }, 3000);
                });
            });
        }
    }
});
