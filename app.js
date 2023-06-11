(function main() {
  let elementList = []
  let divIdList = []

  const generalObserver = new MutationObserver((mut) => mut.forEach((item) =>  {
    if ([...item.addedNodes].findIndex((i) => i.className === 'catalog-page__content') !== -1) {
      getProductCardList()
    }
  }))
  
  generalObserver.observe(document.getElementById('app'), {
    childList: true, 
    subtree: true,
    attributes: false,
    characterDataOldValue: false 
  });

  function getElements() {
    elementList = document.querySelectorAll('[class*="--adv"]');
    divIdList = divIdList.filter((divId) => [...elementList].find((el) => +el.getAttribute('data-nm-id') === divId))
    if (elementList.length !== 0) getDataFromDb()
  }

  function getProductCardList() {
    const productCardList = document.querySelectorAll('.product-card-list')
    
    getElements()
    
    productCardList.forEach((productCard) => {
      const productCardObserver = new MutationObserver(getElements)
      productCardObserver.observe(productCard, {
        childList: true, 
        subtree: true,
        attributes: false,
        characterDataOldValue: false 
      });  
    })
  }

  function getDataFromDb() {
    let params = new URL(document.location).searchParams
    let search = params.get("search")
    let object_store_name = `search-${search}`

    const request = indexedDB.open('wb_catalog_adverts');

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(['adverts_info'], 'readonly');
      const objectStore = transaction.objectStore('adverts_info');
      const getRequestAll = objectStore.getAll();

      getRequestAll.onsuccess = function (event) {
        if (event.target.result && event.target.result.find((item) => item.id === object_store_name) != -1) {
          const getRequest = objectStore.get(object_store_name);

          getRequest.onsuccess = function (event) {
            const data = event?.target?.result?.model?.advData.adverts;
            if (data) {
              elementList.forEach((card) => {
                const cardNmId = +card.getAttribute('data-nm-id')
                const item = data.find((item) => item.id === cardNmId) 
                if (!divIdList.includes(cardNmId)) {
                  divIdList.push(cardNmId)
                  const div = document.createElement("div");
                  
                  const cpm = item ? item.cpm : 'unknown'
                  div.innerText = `Реклама: ${cpm}₽`
        
                  div.style.color = 'white'
                  div.style.position = 'absolute'
                  div.style.bottom = 0
                  div.style.right = 0
                  div.style.padding = '2px 4px'
                  div.style.backgroundColor = 'rgba(87, 222, 87, 0.8)'
                  div.style.borderTopLeftRadius = '10px'
                  div.style.borderBottomRightRadius = '10px'
                  div.style.display = 'flex'
                  div.style.justifyContent = 'center'
                  div.style.alignItems = 'center'
                  div.style.fontSize = '12px'

                  const cardWrapper = card.querySelector('.product-card__wrapper')
                  
                  cardWrapper.style.border = '2px solid rgba(87, 222, 87, 0.8)'
                  cardWrapper.style.borderRadius = '10px'
                  cardWrapper.appendChild(div)
                }
              })
            }            
          };
    
          getRequest.onerror = function (event) {
            console.error('Error retrieving objects:', event.target.error);
          };
        }
      }     
      
      transaction.oncomplete = function () {
        db.close();
      };
    };

    request.onerror = function (event) {
      console.error('Error opening database:', event.target.error);
    };
  }
}())
