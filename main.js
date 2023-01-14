
let meallrandom = document.getElementById('meallrandom');
let list_elements = document.getElementById('meallrandom');
let pagination_elements = document.getElementById('pagination');

let current_page = 1;
let rows = 6; // amount of items displayed at one page 

async function DisplayList(items, wrapper, rows_per_page, page){
    wrapper.innerHTML = "";
    page--;

    let start = rows_per_page * page;
    let end = start + rows_per_page;

    let paginatedItems = items.slice(start, end);
    console.log(paginatedItems)

    for (let i = 0; i < paginatedItems.length; i++) {
        let item = paginatedItems[i];
        console.log(item)
   
       list_elements.innerHTML += `
       <div class="card mx-5 mb-5"  style="width: 25%;" id="">
       <img src="${item.strMealThumb}" class="card-img-top" alt="...">
       <div class="card-body">
         <h3 class="card-title">${item.strMeal}</h3>
         <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
         <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="getInfo(${item.idMeal})">See details</button>
       </div>
     </div>
   `
        
    }



}

function setupPagination(items, wrapper, rows_per_page) {
    wrapper.innerHTML = "";
    let page_count = Math.ceil(items.length / rows_per_page)
    for (let i = 1; i < page_count + 1; i++) {
        let btn = PaginationButton(i, items)
        wrapper.appendChild(btn);
    
    }
}

function PaginationButton(page, items) {
    let button = document.createElement('button');
    button.innerText = page 

    if (current_page == page) button.classList.add('active')

        button.addEventListener('click', function() {

        current_page = page;
        DisplayList(items, meallrandom, rows, current_page);
        let current_btn = document.querySelector('.pageNumbers button.active')
        current_btn.classList.remove('active')

        button.classList.add('active')
        });
    return button
}

// ========


/* ========================================----------------- showrandomcards -------------======================================== */
let arr;
async function showrandom() {
    for (let i = 0; i < 6; i++) {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")
        arr = await response.json()
        // console.log(arr)
        showdata(arr, 0)

    }
}

    function showdata(arr, i){
        meallrandom.innerHTML += `
        <div class="card mx-5 mb-5"  style="width: 25%;" id="">
        <img src="${arr.meals[i].strMealThumb}" class="card-img-top" alt="...">
        <div class="card-body">
          <h3 class="card-title">${arr.meals[i].strMeal}</h3>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="getInfo(${arr.meals[i].idMeal})">See details</button>
        </div>
      </div>
    `
    }

showrandom()






/* ========================================----------------- PoP UP details card -------------======================================== */

let myArray ;
let myArray2;
async function getInfo(id){

    const response = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id)
    const dataModal = await response.json()

    myArray = "";
    myArray2 = "";

    strIngredient = ""
    strMeasure = ""

    for (let i = 1; i <= 20; i++) {

        if (dataModal.meals[0]["strIngredient" + i] !== "" && dataModal.meals[0]["strIngredient" + i].length > 0 && dataModal.meals[0]["strIngredient" + i] !== "null" ) {
        myArray += `<li>${dataModal.meals[0]["strIngredient" + i]}</li>`
        } 
        if (dataModal.meals[0]["strMeasure" + i] !== "" && dataModal.meals[0]["strMeasure" + i] !== " " && dataModal.meals[0]["strMeasure" + i].length > 0 && dataModal.meals[0]["strMeasure" + i] !== "null" ) {        
            myArray2 += `<li>${dataModal.meals[0]["strMeasure" + i]}</li>`
        } 
}

    let modal = document.getElementById('modaldetails');
    modal.innerHTML = `
    <h1>${dataModal.meals[0].strMeal}</h1>
    <div class="d-flex gap-5">
    <img src="${dataModal.meals[0].strMealThumb}" style="width: 500px;" class="card-img-top" alt="...">
    <div class = "d-flex">
    <ul>
    ${myArray}
    </ul>
    <ul>
    ${myArray2}
    </ul>
    </div>
    </div>
    <h3><strong>Category   </strong>${dataModal.meals[0].strCategory}</h3>
    <h3><strong>Region   </strong>${dataModal.meals[0].strArea}</h3>
    <iframe width="640" height="390" src="${dataModal.meals[0].strYoutube.replace("https://www.youtube.com/watch?v=" , "https://www.youtube.com/embed/" )}"
    title="Fetching API data and displaying API data inside table." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media;
    gyroscope; picture-in-picture" allowfullscreen>
    </iframe>
    <h3>Instructons</h3>
    <p>${dataModal.meals[0].strInstructions}</p>
    `
};








/* =====================================----------- search by inputs    --------------=================================== */
let dataserchByName;
document.getElementById('inputvalue').addEventListener("keyup", function(e){
    async function getAllData() {
        meallrandom.innerHTML =""    
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + e.target.value );
        dataserchByName = await response.json();   

    for (let i = 0; i < dataserchByName.meals.length; i++) {
                DisplayList(dataserchByName.meals, meallrandom, rows, current_page);
                setupPagination(dataserchByName.meals, pagination_elements, rows);
        } 
        }
    getAllData()
    console.log(dataserchByName.meals)  
    })




// ===============================----------- Import all options    --------------==============================
let optionsincategory = document.getElementById('category');
let optionsinRegion = document.getElementById('region');
let allstrCategory;
let allstrAreas;

async function importthecategoryandregion() {
const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list"); //area list

               allstrCategory = await response.json();
                allstrCategory.meals.map(function(meals) { 
                optionsincategory.innerHTML += `<option>${meals.strCategory}</option>`
                })

                // =======================================================
                const resPonse = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list"); //categoy list
                allstrAreas = await resPonse.json();
                allstrAreas.meals.map(function(meals) {  
                   optionsinRegion.innerHTML += `<option>${meals.strArea}</option>`
                })
}
importthecategoryandregion() 

// ===========-------------------------- Search by category and region   --------------------------=========

let errormsg = document.getElementById('error');
let seachBycateAndREgion = document.getElementById('seachby2');
let regionarr;
let category;
let categoryRegionmeal = [];
// ====================== region search ==========================
seachBycateAndREgion.addEventListener('click', async function() {

console.log(optionsinRegion.value)
console.log(optionsincategory.value)
if (optionsincategory.value == "All Categories" && optionsinRegion.value !== "All Regions" ) {
    errormsg.innerHTML = ""
    meallrandom.innerHTML = ""
    const resPonse = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?a=" + optionsinRegion.value);
    regionarr = await resPonse.json();

        console.log(regionarr)
        console.log(regionarr.meals)

    for (let k = 0; k < regionarr.meals.length; k++) {


        DisplayList(regionarr.meals, meallrandom, rows, current_page);
        setupPagination(regionarr.meals, pagination_elements, rows);

        // showdata(regionarr, k)           
    }

// =============== category search ======================

} else if (optionsincategory.value !== "All Categories" && optionsinRegion.value == "All Regions"){
    errormsg.innerHTML = ""
    meallrandom.innerHTML = ""
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + optionsincategory.value);
    category = await response.json();
  console.log(category)
  
    for (let k = 0; k < category.meals.length; k++) {

        DisplayList(category.meals, meallrandom, rows, current_page);
        setupPagination(category.meals, pagination_elements, rows);
      
    }

// =============== both  ======================
} else if (optionsincategory.value !== "All Categories" && optionsinRegion.value !== "All Regions"){
    errormsg.innerHTML = ""
    meallrandom.innerHTML = ""
categoryRegionmeal.length = 0
// ------------------ region api -------------
const resPonse = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?a=" + optionsinRegion.value);
    regionarr = await resPonse.json();
// ------------------ Category  api -------------
const response = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + optionsincategory.value);
category = await response.json();

for (let h = 0; h < category.meals.length; h++) {
        for (let k = 0; k < regionarr.meals.length; k++) {
            
            if (regionarr.meals[k].idMeal == category.meals[h].idMeal) {
                categoryRegionmeal.push(regionarr.meals[k]);
               
               DisplayList(regionarr.meals, meallrandom, rows, current_page);
               setupPagination(regionarr.meals, pagination_elements, rows);
        

            }    
        }

}
//======== ERROR messg
if (categoryRegionmeal.length == 0) {
    errormsg.innerHTML = `
      <h5 class="text-secondary text-center">No match for your search</h5>   
      <p class="text-secondary text-center">try somthing else</p>     
`
} 

//============================ ALL CATEGORIES ALL REGIONS ======================================

} else if (optionsincategory.value == "All Categories" && optionsinRegion.value == "All Regions"){

    const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list")
    const allmealscategorie = await response.json()
    meallrandom.innerHTML = ""
    let allmealsbasedoncategorie = [];


    for (let i = 0; i < allmealscategorie.meals.length; i++) {
            const resPonse = await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=" + allmealscategorie.meals[i].strCategory)
            const allmealscategorienaes = await resPonse.json()
            allmealsbasedoncategorie.push(allmealscategorienaes.meals)         
    }

allmealsbasedoncategorie = allmealsbasedoncategorie.flat(1)   
meallrandom.innerHTML = ""

for (let i = 0; i < allmealsbasedoncategorie.length; i++) {

    DisplayList(allmealsbasedoncategorie, meallrandom, rows, current_page);
    setupPagination(allmealsbasedoncategorie, pagination_elements, rows);

}     
}  
});
