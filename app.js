(function main() {
  
  const callLimit = 15
  let isRunning = false
  let elementList = []
  let count = 0

  function getElements() {
    setTimeout(function runTimeout() {
      if (count < callLimit && elementList.length === 0) {
        elementList = document.querySelectorAll('[class*="-adv"]');
        setTimeout(runTimeout, 500);
      } else {
        isRunning = false
        if (elementList.length !== 0) getDataFromDb()
      }
      count++;
    }, 500);
  }

  getElements()

  addEventListener("scroll", () => {
    if (!isRunning) {
      isRunning = true
      setTimeout(() => {
        elementList = document.querySelectorAll('[class*="-adv"]')
        isRunning = false
        if (elementList.length !== 0) getDataFromDb()
      }, 500)
    }
  });

  function getDataFromDb() {
    let params = new URL(document.location).searchParams
    let search = params.get("search")
    let object_store_name = `search-${search}`

    const request = indexedDB.open('wb_catalog_adverts');

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(['adverts_info'], 'readonly');
      const objectStore = transaction.objectStore('adverts_info');
      const getRequest = objectStore.get(object_store_name);

      getRequest.onsuccess = function (event) {
        const data = event.target.result.model.advData.adverts;
        elementList.forEach((card) => {
          const item = data.find((item) => item.id === +card.getAttribute('data-nm-id'))
          const cpm = item ? item.cpm : 'unknown'
          const div = document.createElement("div");
          div.innerText = `${cpm}`
          div.style.position = 'absolute'
          div.style.bottom = 0
          div.style.right = 0
          div.style.padding = '2px 4px'
          div.style.backgroundColor = 'rgb(102, 255, 102)'
          div.style.borderTopLeftRadius = '10px'

          card.style.border = '3px solid rgb(102, 255, 102)'
          card.style.borderRadius = '10px'
          card.style.position = 'relative'
          card.appendChild(div)
        })
      };

      getRequest.onerror = function (event) {
        console.error('Error retrieving objects:', event.target.error);
      };

      transaction.oncomplete = function () {
        db.close();
      };
    };

    request.onerror = function (event) {
      console.error('Error opening database:', event.target.error);
    };
  }

}())