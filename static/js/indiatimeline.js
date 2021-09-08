
// key from month name to number
var monthKey = {
    'January': '01',
    'February': '02',
    'March': '03',
    'April': '04',
    'May': '05',
    'June': '06',
    'July': '07',
    'August': '08',
    'September': '09',
    'October': '10',
    'November': '11',
    'December': '12'
}

// parsing the date format in the data into a date value
var parseDateFormat = function(dateString) {
    var day = dateString.substr(0, 2);
    var month = monthKey[dateString.substring(3, dateString.length - 1)]

    // 2020 data only, data doesn't specify a year yet
    return Date.parse('2020-' + month + '-' + day)
}

var tableViewModel = function(){
    return {
        // data variables
        api: 'https://data.covid19india.org/data.json',
        data: [],
        cases: [],
        searchInput: '',
        sortAsc: false,
        sortField: 'date',
        // initializes the retrieved data
        getData() {
            fetch(this.api)
            .then(response => {
                let data = response.json()
                return data
            })
            .then(data => {
                // console.log(data)
                this.data = data
                this.cases = data.cases_time_series.slice()

                // remove loader
                var preloader = document.getElementById('loader')
                preloader.style.display = 'none'

                // set to default sort
                this.sortRow(this.sortField, true)
            })
        },
        // sorts the row when clicking on header
        // - rowField is the field to change to
        // - noSortChange is there is no sorting change like on reset
        sortRow(rowField, noSortChange) {
            // change field for ascending sort if same field
            if(this.sortField === rowField && !noSortChange) this.sortAsc = !this.sortAsc

            var sorted
            if(rowField === 'date'){
                sorted = this.cases.sort((a, b) => {
                    var aDate = parseDateFormat(a.date)
                    var bDate = parseDateFormat(b.date)

                    // direction of sort changes when clicking on the same field
                    if(this.sortAsc){
                        if(aDate < bDate) return -1
                        if(aDate > bDate) return 1
                        
                    } else {
                        if(aDate > bDate) return -1
                        if(aDate < bDate) return 1
                    }

                    return 0

                })
                
            } else {
                sorted = this.cases.sort((a, b) => {
                    // direction of sort changes when clicking on the same field
                    var aNum = parseInt(a[rowField]) 
                    var bNum = parseInt(b[rowField]) 
                    if(this.sortAsc){
                        if(aNum < bNum) return -1
                        if(aNum > bNum) return 1
                    } else {
                        if(aNum > bNum) return -1
                        if(aNum < bNum) return 1
                    }
                    return 0
                })
            }

            // set new current sort field
            this.sortField = rowField
            // set new data
            this.cases = sorted
        },
        // updates the search with the input, called on input change
        updateSearch(event) {
            var pattern = new RegExp(this.searchInput.toUpperCase(), 'g')
            var filtered
            filtered = this.data.cases_time_series.slice().filter(row => pattern.test(row.date.toUpperCase()))

            this.cases = filtered
            this.sortRow(this.sortField, true)
        },
        // resets the search to whatever is currently set
        resetSearch(event) {
            this.cases = this.data.cases_time_series.slice()
            this.sortRow(this.sortField, true)
            this.searchInput = ''
        }
    }
}