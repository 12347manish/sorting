window.bubbleSortForReact = async (currentArray, setArrayCallback, onSortFinishCallback, arrayContainerRef, sortSpeedMs = 50, checkStopSignal = () => false) => {
    let arr = [...currentArray];
    const n = arr.length;
    const bars = arrayContainerRef.current ? arrayContainerRef.current.children : [];
    const defaultBarColor = '#3498db';

    const cleanupAndExit = () => {
        if (arrayContainerRef.current) {
            for (let k = 0; k < bars.length; k++) {
                if (bars[k] && bars[k].style.backgroundColor !== 'green') {
                    bars[k].style.backgroundColor = defaultBarColor;
                }
            }
        }
        setArrayCallback([...arr]);
        onSortFinishCallback();
    };

    if (!arrayContainerRef.current || bars.length !== n) {
        onSortFinishCallback();
        return;
    }
    if (checkStopSignal()) { cleanupAndExit(); return; }

    for (let i = 0; i < n - 1; i++) {
        if (checkStopSignal()) { cleanupAndExit(); return; }
        for (let j = 0; j < n - i - 1; j++) {
            if (checkStopSignal()) { cleanupAndExit(); return; }
            if (!bars[j] || !bars[j+1]) { cleanupAndExit(); return; } 

            bars[j].style.backgroundColor = 'red';
            bars[j + 1].style.backgroundColor = 'red';
            setArrayCallback([...arr]); 
            await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
            if (checkStopSignal()) { cleanupAndExit(); return; }

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                bars[j].style.height = `${arr[j]}px`;
                bars[j + 1].style.height = `${arr[j + 1]}px`;
                setArrayCallback([...arr]); 
                await new Promise(resolve => setTimeout(resolve, sortSpeedMs)); 
                if (checkStopSignal()) { cleanupAndExit(); return; }
            }
            bars[j].style.backgroundColor = defaultBarColor;
            bars[j + 1].style.backgroundColor = defaultBarColor;
        }
        if (bars[n - 1 - i]) bars[n - 1 - i].style.backgroundColor = 'green';
        if (checkStopSignal()) { cleanupAndExit(); return; }
    }
    if (n > 0 && bars[0] && bars[0].style.backgroundColor !== 'green') bars[0].style.backgroundColor = 'green'; 

    onSortFinishCallback();
};

window.mergeSortForReact = async (currentArray, setArrayCallback, onSortFinishCallback, arrayContainerRef, sortSpeedMs = 100, checkStopSignal = () => false) => {
    let arr = [...currentArray];
    const n = arr.length;
    const bars = arrayContainerRef.current ? arrayContainerRef.current.children : [];
    const defaultBarColor = '#3498db';

    const cleanupAndExit = () => {
        if (arrayContainerRef.current) {
            for (let k = 0; k < bars.length; k++) {
                if (bars[k] && bars[k].style.backgroundColor !== 'green' && bars[k].style.backgroundColor !== 'cadetblue') {
                    bars[k].style.backgroundColor = defaultBarColor;
                }
            }
        }
        setArrayCallback([...arr]);
        onSortFinishCallback();
    };

    if (!arrayContainerRef.current || bars.length !== n) {
        onSortFinishCallback();
        return;
    }
    if (checkStopSignal()) { cleanupAndExit(); return; }

    async function merge(l, m, r) {
        if (checkStopSignal()) return false; // Signal to stop

        const n1 = m - l + 1;
        const n2 = r - m;
        let L = new Array(n1);
        let R = new Array(n2);

        for (let i = 0; i < n1; i++) L[i] = arr[l + i];
        for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

        for (let k = l; k <= r; k++) {
            if (bars[k]) bars[k].style.backgroundColor = 'orange';
        }
        setArrayCallback([...arr]);
        await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
        if (checkStopSignal()) return false;

        let i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            if (checkStopSignal()) return false;
            if (bars[l+i]) bars[l+i].style.backgroundColor = 'red';
            if (bars[m+1+j]) bars[m+1+j].style.backgroundColor = 'red';
            setArrayCallback([...arr]);
            await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
            if (checkStopSignal()) return false;

            if (L[i] <= R[j]) {
                arr[k] = L[i];
                if (bars[l+i]) bars[l+i].style.backgroundColor = defaultBarColor;
                i++;
            } else {
                arr[k] = R[j];
                if (bars[m+1+j]) bars[m+1+j].style.backgroundColor = defaultBarColor;
                j++;
            }
            if (bars[k]) {
                bars[k].style.height = `${arr[k]}px`;
                bars[k].style.backgroundColor = 'purple';
            }
            setArrayCallback([...arr]);
            await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
            if (checkStopSignal()) return false;
            if (bars[k]) bars[k].style.backgroundColor = defaultBarColor;
            k++;
        }

        while (i < n1) {
            if (checkStopSignal()) return false;
            arr[k] = L[i];
            if (bars[k]) {
                bars[k].style.height = `${arr[k]}px`;
                bars[k].style.backgroundColor = 'purple';
            }
            setArrayCallback([...arr]);
            await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
            if (checkStopSignal()) return false;
            if (bars[k]) bars[k].style.backgroundColor = defaultBarColor;
            i++; k++;
        }
        while (j < n2) {
            if (checkStopSignal()) return false;
            arr[k] = R[j];
            if (bars[k]) {
                bars[k].style.height = `${arr[k]}px`;
                bars[k].style.backgroundColor = 'purple';
            }
            setArrayCallback([...arr]);
            await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
            if (checkStopSignal()) return false;
            if (bars[k]) bars[k].style.backgroundColor = defaultBarColor;
            j++; k++;
        }
        for (let idx = l; idx <= r; idx++) {
            if (bars[idx]) bars[idx].style.backgroundColor = 'cadetblue';
        }
        setArrayCallback([...arr]);
        await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
        return true; // Indicate success
    }

    async function sort(l, r) {
        if (checkStopSignal()) return false;
        if (l >= r) {
            if (bars[l]) bars[l].style.backgroundColor = 'green'; // Potentially mark as sorted
            return true;
        }
        const m = l + Math.floor((r - l) / 2);
        if (!await sort(l, m)) return false;
        if (checkStopSignal()) return false;
        if (!await sort(m + 1, r)) return false;
        if (checkStopSignal()) return false;
        if (!await merge(l, m, r)) return false;
        return true;
    }

    const success = await sort(0, n - 1);
    if (!success || checkStopSignal()) { // if sort was stopped or failed
        cleanupAndExit();
        return;
    }

    if (arrayContainerRef.current) {
        for (let i = 0; i < n; i++) {
            if (bars[i]) bars[i].style.backgroundColor = 'green';
        }
    }
    setArrayCallback([...arr]);
    onSortFinishCallback();
};

window.quickSortForReact = async (currentArray, setArrayCallback, onSortFinishCallback, arrayContainerRef, sortSpeedMs = 50, checkStopSignal = () => false) => {
    let arr = [...currentArray];
    const n = arr.length;
    const bars = arrayContainerRef.current ? arrayContainerRef.current.children : [];
    const defaultBarColor = '#3498db';

    const cleanupAndExit = () => {
        if (arrayContainerRef.current) {
            for (let k = 0; k < bars.length; k++) {
                if (bars[k] && bars[k].style.backgroundColor !== 'green') {
                    bars[k].style.backgroundColor = defaultBarColor;
                }
            }
        }
        setArrayCallback([...arr]);
        onSortFinishCallback();
    };

    if (!arrayContainerRef.current || bars.length !== n) {
        onSortFinishCallback();
        return;
    }
    if (checkStopSignal()) { cleanupAndExit(); return; }

    async function partition(low, high) {
        if (checkStopSignal()) return -2; // Special value for stop
        const pivotValue = arr[high];
        if (bars[high]) bars[high].style.backgroundColor = 'purple';

        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (checkStopSignal()) return -2;
            if (bars[j]) bars[j].style.backgroundColor = 'red';
            if (bars[i+1] && i+1 !== high) bars[i+1].style.backgroundColor = 'orange';
            setArrayCallback([...arr]);
            await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
            if (checkStopSignal()) return -2;

            if (arr[j] < pivotValue) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                if (bars[i]) bars[i].style.height = `${arr[i]}px`;
                if (bars[j]) bars[j].style.height = `${arr[j]}px`;
                if (bars[i]) bars[i].style.backgroundColor = 'pink';
                if (bars[j]) bars[j].style.backgroundColor = 'pink';
                setArrayCallback([...arr]);
                await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
                if (checkStopSignal()) return -2;
            }
            if (bars[j]) bars[j].style.backgroundColor = defaultBarColor;
            if (bars[i+1] && i+1 !== high) bars[i+1].style.backgroundColor = defaultBarColor;
            if (bars[i] && bars[i].style.backgroundColor === 'pink') bars[i].style.backgroundColor = defaultBarColor;
        }

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        if (bars[i+1]) bars[i+1].style.height = `${arr[i+1]}px`;
        if (bars[high]) bars[high].style.height = `${arr[high]}px`;
        setArrayCallback([...arr]);
        await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
        if (checkStopSignal()) return -2;

        if (bars[high]) bars[high].style.backgroundColor = defaultBarColor;
        if (bars[i+1]) bars[i+1].style.backgroundColor = 'green';
        return i + 1;
    }

    async function sort(low, high) {
        if (checkStopSignal()) return false;
        if (low < high) {
            let pi = await partition(low, high);
            if (pi === -2 || checkStopSignal()) return false; // Stopped during partition

            for(let k=low; k < pi; k++) if(bars[k] && bars[k].style.backgroundColor !== 'green') bars[k].style.backgroundColor = 'lightblue';
            setArrayCallback([...arr]);
            await new Promise(resolve => setTimeout(resolve, sortSpeedMs/2));
            if (checkStopSignal()) return false;

            if (!await sort(low, pi - 1)) return false;
            if (checkStopSignal()) return false;
            
            for(let k=pi+1; k <= high; k++) if(bars[k] && bars[k].style.backgroundColor !== 'green') bars[k].style.backgroundColor = 'lightblue';
            setArrayCallback([...arr]);
            await new Promise(resolve => setTimeout(resolve, sortSpeedMs/2));
            if (checkStopSignal()) return false;

            if (!await sort(pi + 1, high)) return false;
            if (checkStopSignal()) return false;

            for(let k=low; k <= high; k++) {
                if(bars[k] && bars[k].style.backgroundColor === 'lightblue') bars[k].style.backgroundColor = defaultBarColor;
            }
        } else if (low === high && bars[low]) {
             bars[low].style.backgroundColor = 'green'; // Base case: single element is sorted
        }
        return true;
    }

    const success = await sort(0, n - 1);
    if (!success || checkStopSignal()) {
        cleanupAndExit();
        return;
    }

    if (arrayContainerRef.current) {
        for (let i = 0; i < n; i++) {
            if (bars[i] && bars[i].style.backgroundColor !== 'green') bars[i].style.backgroundColor = 'green';
        }
    }
    setArrayCallback([...arr]);
    onSortFinishCallback();
};

window.selectionSortForReact = async (currentArray, setArrayCallback, onSortFinishCallback, arrayContainerRef, sortSpeedMs = 50, checkStopSignal = () => false) => {
    let arr = [...currentArray];
    const n = arr.length;
    const bars = arrayContainerRef.current ? arrayContainerRef.current.children : [];
    const defaultBarColor = '#3498db';

    const cleanupAndExit = () => {
        if (arrayContainerRef.current) {
            for (let k = 0; k < bars.length; k++) {
                if (bars[k] && bars[k].style.backgroundColor !== 'green') {
                    bars[k].style.backgroundColor = defaultBarColor;
                }
            }
        }
        setArrayCallback([...arr]);
        onSortFinishCallback();
    };

    if (!arrayContainerRef.current || bars.length !== n) {
        onSortFinishCallback();
        return;
    }
    if (checkStopSignal()) { cleanupAndExit(); return; }

    for (let i = 0; i < n - 1; i++) {
        if (checkStopSignal()) { cleanupAndExit(); return; }
        let minIdx = i;
        if (bars[minIdx]) bars[minIdx].style.backgroundColor = 'purple';
        setArrayCallback([...arr]);
        await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
        if (checkStopSignal()) { cleanupAndExit(); return; }

        for (let j = i + 1; j < n; j++) {
            if (checkStopSignal()) { cleanupAndExit(); return; }
            if (bars[j]) bars[j].style.backgroundColor = 'red';
            setArrayCallback([...arr]);
            await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
            if (checkStopSignal()) { cleanupAndExit(); return; }

            if (arr[j] < arr[minIdx]) {
                if (bars[minIdx] && minIdx !== i) bars[minIdx].style.backgroundColor = defaultBarColor;
                minIdx = j;
                if (bars[minIdx]) bars[minIdx].style.backgroundColor = 'purple';
                setArrayCallback([...arr]);
                await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
                if (checkStopSignal()) { cleanupAndExit(); return; }
            }
            if (bars[j] && j !== minIdx) bars[j].style.backgroundColor = defaultBarColor;
        }

        if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            if (bars[i]) bars[i].style.height = `${arr[i]}px`;
            if (bars[minIdx]) bars[minIdx].style.height = `${arr[minIdx]}px`;
            if (bars[i]) bars[i].style.backgroundColor = 'orange';
            if (bars[minIdx] && bars[minIdx].style.backgroundColor !== 'purple') bars[minIdx].style.backgroundColor = 'orange';
            setArrayCallback([...arr]);
            await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
            if (checkStopSignal()) { cleanupAndExit(); return; }
        }
        
        if (bars[minIdx]) bars[minIdx].style.backgroundColor = defaultBarColor;
        if (bars[i]) bars[i].style.backgroundColor = 'green';
        setArrayCallback([...arr]);
        if (checkStopSignal()) { cleanupAndExit(); return; }
    }
    if (n > 0 && bars[n - 1] && bars[n-1].style.backgroundColor !== 'green') bars[n - 1].style.backgroundColor = 'green';
    
    onSortFinishCallback();
};

window.heapSortForReact = async (currentArray, setArrayCallback, onSortFinishCallback, arrayContainerRef, sortSpeedMs = 75, checkStopSignal = () => false) => {
    let arr = [...currentArray];
    const n = arr.length;
    const bars = arrayContainerRef.current ? arrayContainerRef.current.children : [];
    const defaultBarColor = '#3498db';

    const cleanupAndExit = () => {
        if (arrayContainerRef.current) {
            for (let k = 0; k < bars.length; k++) {
                if (bars[k] && bars[k].style.backgroundColor !== 'green') {
                    bars[k].style.backgroundColor = defaultBarColor;
                }
            }
        }
        setArrayCallback([...arr]);
        onSortFinishCallback();
    };

    if (!arrayContainerRef.current || bars.length !== n) {
        onSortFinishCallback();
        return;
    }
    if (checkStopSignal()) { cleanupAndExit(); return; }

    async function heapify(size, i) {
        if (checkStopSignal()) return false; 
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;

        if (bars[i]) bars[i].style.backgroundColor = 'orange';
        setArrayCallback([...arr]); 
        // No await here, color is set, then comparison happens

        if (left < size) {
            if (bars[left]) bars[left].style.backgroundColor = 'red';
            setArrayCallback([...arr]);
            await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
            if (checkStopSignal()) return false;
            if (arr[left] > arr[largest]) largest = left;
            if (bars[left]) bars[left].style.backgroundColor = defaultBarColor;
        }

        if (right < size) {
            if (bars[right]) bars[right].style.backgroundColor = 'red';
            setArrayCallback([...arr]);
            await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
            if (checkStopSignal()) return false;
            if (arr[right] > arr[largest]) largest = right;
            if (bars[right]) bars[right].style.backgroundColor = defaultBarColor;
        }
        
        if (bars[i]) bars[i].style.backgroundColor = defaultBarColor;

        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            if (bars[i]) bars[i].style.height = `${arr[i]}px`;
            if (bars[largest]) bars[largest].style.height = `${arr[largest]}px`;
            if (bars[i]) bars[i].style.backgroundColor = 'pink';
            if (bars[largest]) bars[largest].style.backgroundColor = 'pink';
            setArrayCallback([...arr]);
            await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
            if (checkStopSignal()) return false;
            if (bars[i]) bars[i].style.backgroundColor = defaultBarColor;
            if (bars[largest]) bars[largest].style.backgroundColor = defaultBarColor;
            if (!await heapify(size, largest)) return false;
        }
        return true;
    }

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if (checkStopSignal()) { cleanupAndExit(); return; }
        if (!await heapify(n, i)) { cleanupAndExit(); return; }
    }

    for (let i = n - 1; i > 0; i--) {
        if (checkStopSignal()) { cleanupAndExit(); return; }
        [arr[0], arr[i]] = [arr[i], arr[0]];
        if (bars[0]) bars[0].style.height = `${arr[0]}px`;
        if (bars[i]) bars[i].style.height = `${arr[i]}px`;
        if (bars[i]) bars[i].style.backgroundColor = 'green';
        if (bars[0]) bars[0].style.backgroundColor = 'orange';
        setArrayCallback([...arr]);
        await new Promise(resolve => setTimeout(resolve, sortSpeedMs));
        if (checkStopSignal()) { cleanupAndExit(); return; }
        if (bars[0] && bars[0].style.backgroundColor === 'orange') bars[0].style.backgroundColor = defaultBarColor;

        if (!await heapify(i, 0)) { cleanupAndExit(); return; }
         if (bars[0] && bars[0].style.backgroundColor !== 'green' && bars[0].style.backgroundColor !== 'red' && bars[0].style.backgroundColor !== 'orange' && bars[0].style.backgroundColor !== 'purple' && bars[0].style.backgroundColor !== 'pink') {
            bars[0].style.backgroundColor = defaultBarColor;
        }
    }

    if (n > 0 && bars[0] && bars[0].style.backgroundColor !== 'green') bars[0].style.backgroundColor = 'green';
    
    setArrayCallback([...arr]);
    onSortFinishCallback();
};
