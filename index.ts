import fs from 'fs';
import readline from 'readline';
// import { printMode_0 } from './PrintMode';
import { Person } from './type';
import { pageParams } from './type';
import { Mode } from './type';



let fullList: Array<Person> = [];
let searchModeItems: Array<Person> = [];


// let searchModePaginate:Person= {
//     name : '',
//     site : '',
//     number : '',
// };


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


function initList() {
    fullList = JSON.parse(fs.readFileSync('dist/data/data.json', 'utf8'));
}


function saveList(tempPerson:Person) {
    const newDataList = [ ...fullList ];
    const newData = { ...tempPerson};
    newDataList.push(newData);
    const newDataJson = JSON.stringify(newDataList, null, 2);
    fs.writeFileSync('dist/data/data.json', newDataJson);
    initList(); 
}

function updateList(idx:string, cat:string, value:string) {

    const updatedDataList = [...fullList];
    for(let i=0; i<updatedDataList.length; i++){
        if(i == Number(idx)) {
            updatedDataList[i][cat] = value;
        }
    }
    const updatedDataListJson = JSON.stringify(updatedDataList, null, 2);
    console.log(` ${cat}이 ${value}으로 변경되었습니다` );
    fs.writeFileSync('dist/data/data.json', updatedDataListJson);
    initList(); 
}

function deleteList(idx:string) {
    const deletedDataList = [...fullList];
    
    for(let i=Number(idx); i < deletedDataList.length-1; i++) {
        deletedDataList[i] = deletedDataList[i+1];
    }
    deletedDataList.length--;

    const deletedDataListJson = JSON.stringify(deletedDataList, null, 2);
    console.log(`인덱스 ${idx}의 리스트가 삭제되었습니다`);
    fs.writeFileSync('dist/data/data.json', deletedDataListJson);
    initList();
    idx = "";
}

function itemModifySelector(mode:Mode, input: string) {
    // console.log(`itemModifySelector로 들어온 값 slave : ${mode.slave} , modify : ${mode.modify}`);

    switch(input) {
        case '1' : {
            if(mode.modify == 1) {
                mode.modify = 2;
            }else {
                mode.modify = 1;
            }
            break;
        }

        case '2' : {
            if(mode.slave == 1 && mode.modify == 0) {
                mode.slave = 2;
            }else if(mode.slave == 2 && mode.modify == 0){
                mode.slave = 1;
            }else{
                mode.modify = 3;
            }         
            break;
        }

        case '3' : {
            if(mode.slave == 1 && mode.modify == 0){
                mode.slave = 3;
            }else{
                mode.modify = 4;
            }
            break;
        }

        case '4' : {
            // 같은 커맨드로 돌아가기       
            if(mode.modify == 0 && mode.slave == 1) {
                mode.master = 0;
                mode.slave = 0;
                mode.modify = 0;
                mode.idxInfo.name = '';
                mode.idxInfo.site = '';
                mode.idxInfo.number = '';
                mode.idx="";
            }else{
                mode.modify = 0;
                mode.slave = 1;
            }
            break;   
        }
    }
}


function itemModifier(mode:Mode, input: string) {
    // console.log(`itemModifier 로 들어온 값 ${input}`);
    if(mode.modify == 4 && input.length > 1) {
        const cat = 'number';
        updateList(mode.idx, cat ,input);
        mode.modify = 1;
    }else if(mode.modify == 3 && input.length > 1) {
        const cat = 'site';
        updateList(mode.idx, cat, input);
        mode.modify = 1;
    }else if(mode.modify == 2 && input.length > 1) {
        const cat = 'name';
        updateList(mode.idx, cat, input);
        mode.modify = 1;
    }
}

function startPchanger(mode:Mode) {

    if(mode.pageParams.curPage <= 1) {
        return 0;
    }else {
        return mode.pageParams.curPage-mode.pageParams.perPage;
    }
}

function endPchanger(mode:Mode){
    if(mode.pageParams.curPage == 0) {        
        return fullList.length;
    }
    else if(mode.pageParams.curPage == 1){
        return mode.pageParams.curPage + mode.pageParams.perPage - 1;
    }else{
        return mode.pageParams.curPage;
    }      
    
}


function printMode_0(mode: Mode) {
    console.log('');
    console.log('원하는 모드명을 입력해주세요');
    console.log('개별 목록 선택시 개별목록선택 모드에서 인덱스 번호 입력');
    console.log('검색 : 1');
    console.log('신규유저추가 : 2');
    console.log('개별목록선택 : 3');
    console.log('다음 페이지 : 4');
    console.log('이전 페이지 : 5');
    console.log('마지막 페이지 : 6');
    console.log('첫 페이지 : 7');
    console.log('프로그램 종료 : 8');
    process.stdout.write('command in [1~8]>> ');
}


function printMode_1_header(mode: Mode) {
    let searchTarget: string = '없음';
    if(mode.searchCondition.name.length > 0) searchTarget = `이름: ${mode.searchCondition.name}`;
    else if(mode.searchCondition.site.length > 0) searchTarget = `지역: ${mode.searchCondition.site}`;
    else if(mode.searchCondition.number.length > 0) searchTarget = `번호: ${mode.searchCondition.number}`;
    console.log(`검색 조건 [[ ${searchTarget} ]]`);
}


function printMode_1(mode: Mode) {

    // console.log(`프린트모드 1  'm:' + ${mode.master}, 's:' + ${mode.slave}`);
    switch(mode.slave) {
        case 0: {
            console.log('검색을 원하는 필드를 입력 해 주세요');
            console.log('1. 이름 2. 지역 3. 번호 4. 취소(전체 목록 출력) 5. 나가기 6. 다음 페이지 7. 이전 페이지 8. 마지막 페이지 9. 맨 앞 페이지');
            process.stdout.write('command in [1~9]>> ');
            break;
        }
        case 1: {
            process.stdout.write('이름>> ');
            break;
        }
        case 2: {
            process.stdout.write('지역>> ');
            break;
        }
        case 3: {
            process.stdout.write('번호>> ');
            break;
        }
    }
}


function printMode_2(mode: Mode) {
    switch(mode.slave) {
        case 0: {
            console.log('이름을 입력하세요');
            break;
        }
        case 1: {
            console.log('지역을 입력하세요');
            break;
        }
        case 2: {
            console.log('번호을 입력하세요');
            break;
        }
        case 3: {
            if(mode.tempPerson.name.length > 0 && mode.tempPerson.site.length > 0 && mode.tempPerson.number.length > 0) {
                console.log('입력 하신 정보는 아래와 같습니다.');
                console.log(`이름: ${mode.tempPerson.name}`);
                console.log(`지역: ${mode.tempPerson.site}`);
                console.log(`번호: ${mode.tempPerson.number}`);
                process.stdout.write('command in [1~3]>> ');   
            }
            console.log('1. 저장 2. 다시 입력 3. 돌아가기');
            break;
        }
        default: {
            console.log(`[printMode_2] 알 수 없는 오류 입니다.`);
            break;
        }
    }   
}


function printIdxChoiceMode(mode: Mode) {
    // console.log(`printIdxChoice 모드 확인 master : ${mode.master}, slave : ${mode.slave}, modify : ${mode.modify}`);
    
    if( mode.modify == 0 ) {
        switch(mode.slave) {

        case 0 : {          
            console.log('개별선택할 인덱스를 입력해주세요')
            break;
        }

        case 1: {
            console.log('내역 수정 : 1, 삭제 : 2, 전화연결 : 3, 나가기 : 4');
            break;
        }

        case 2: {          
            console.log('연락처를 삭제합니까?');
            console.log('확인 : 1, 취소 : 2');           
            break;
        }

        case 3: {
            console.log(`번호 : ${mode.idxInfo.number}로 연결합니다`);
            setTimeout(() => {
                mode.master = 0;
                mode.slave = 0;
                mode.idx = "";
                mode.idxInfo.name = "";
                mode.idxInfo.site = "";
                mode.idxInfo.name = "";
                printList(fullList.length, mode.searchCondition, mode.idx, mode);
                printMode_0(mode);
            },2000)          
            break;
        }

        default: {
            console.log(`[printIdxChoiceMode_2] 알 수 없는 오류 입니다.`);
            break;
        }
    }
}

    switch(mode.modify) {

    case 1: {
        console.log(`수정할 내역을 입력하세요`);
        console.log(`이름 : 1  지역 : 2  번호 : 3  메뉴로 돌아가기 : 4`);
        break;
    }

    case 2: {          
        process.stdout.write('이름>> ');
        break;
    }

    case 3: {
        process.stdout.write('지역>> ');      
        break;
    }
    
    case 4: {
        process.stdout.write('번호>> ');      
        break;
    }
    }
}


function handleMode_0(mode: Mode, input: string) {
    console.log(`input ${input} on mode 0`);
    switch(input) {
        case '1': {
            mode.master = 1;
            mode.pageParams.curPage = 0;
            break;
        }
        case '2': {
            mode.master = 2;
            break;
        }
        case '3': {
            mode.master = 3;
            break;
        }
        case '4': {
            if(mode.pageParams.curPage >= fullList.length - 2) {
                mode.pageParams.curPage = fullList.length;
            }else{
                mode.pageParams.curPage += mode.pageParams.perPage;
            }
            break;
        }
        case '5': {
            if(mode.pageParams.curPage <= mode.pageParams.perPage + 2) {
                mode.pageParams.curPage = 0;
            }else{
                mode.pageParams.curPage -= mode.pageParams.perPage;
            }
            break;
        }
        case '6': {
            mode.pageParams.curPage = fullList.length;
            break;
        }
        case '7': {
            mode.pageParams.curPage = 1;
            break;
        }
        case '8': {
            exit();
            break;
        }
        default: {
            console.log('없는 명령어입니다.');
            break;
        }
    }
    // console.log('m : ' + mode.master + 's: ' + mode.slave);
}



function printList(perPage: number = fullList.length, searchCondition:Person, idx:string, mode:Mode) {
    // note : condition에 따라 출력되는 코드가 추가 되면 이 리스트 코드 하나로 전체 리스트 제어가 가능함
    let limit = Math.min(perPage, fullList.length);


    if( searchModeItems.length == 0 ) {
    for(let j=0; j<fullList.length; j++){
        let item = fullList[j]
        if(item.name == searchCondition.name) {
            searchModeItems.push(item);
        }
        else if(item.site == searchCondition.site) {
            searchModeItems.push(item);
        }
        else if(item.number == searchCondition.number) {
            searchModeItems.push(item);
        }
    }
}


    for(let i = startPchanger(mode); i < endPchanger(mode); i++) {
        
        let item = fullList[i];
        let searchModeItem = searchModeItems[i];

        if(item.name == searchCondition.name) {
            console.log( `인덱스 ${i}, 이름 : ${item.name}, 지역 : ${item.site}, 번호 : ${item.number}` );
        }
        else if(item.site == searchCondition.site) {

            console.log( `인덱스 ${i}, 이름 : ${item.name}, 지역 : ${item.site}, 번호 : ${item.number}` );
        }
        else if(item.number == searchCondition.number) {
            console.log( `인덱스 ${i}, 이름 : ${item.name}, 지역 : ${item.site}, 번호 : ${item.number}` );
        }
        else if(!idx && (searchCondition.name.length == 0 && searchCondition.number.length == 0 && searchCondition.site.length == 0)) {
            console.log( `인덱스 ${i}, 이름 : ${item.name}, 지역 : ${item.site}, 번호 : ${item.number}` );
        }
        else if(i == parseInt(idx)) {
            console.log( `인덱스 ${i}, 이름 : ${item.name}, 지역 : ${item.site}, 번호 : ${item.number}` );
            mode.idxInfo = {...item};
        }
        // }else if((mode.master == 1) && (searchModeItems.length > 0)) {
        //     console.log(`인덱스 ${i}, 이름 : ${item.name}, 지역 : ${searchModeItem}, 번호 : ${item.number}`);
        // }     
    }
        searchCondition.name = '';
        searchCondition.number = '';
        searchCondition.site = '';
}



function handleMode_1(mode: Mode, input: string) {
    console.log(`input ${input} on mode 1`);
    console.log('m : ' + mode.master + ' s: ' + mode.slave);

    switch(mode.slave) {

        case 0: {
            switch(input) {
                case '1': { mode.slave = 1; break;} 
                case '2': { mode.slave = 2; break;} 
                case '3': { mode.slave = 3; break;}
                case '4': { mode.slave = 0; mode.pageParams = {...mode.pageParams}; mode.searchCondition.name = '', mode.searchCondition.site = '', mode.searchCondition.number = '', searchModeItems.length = 0; console.log('slave 모드 변경', mode.slave); break; } 
                case '5': { mode.master = 0; mode.slave = 0; mode.pageParams = {...mode.pageParams}; mode.searchCondition.name = '', mode.searchCondition.site = '', mode.searchCondition.number = ''; break; }
                case '6' : {
                    if(mode.pageParams.curPage >= searchModeItems.length - 2) {
                        mode.pageParams.curPage = searchModeItems.length;
                    }else{
                        mode.pageParams.curPage += mode.pageParams.perPage;
                    }
                    break;
                }

                case '7' : {
                    if(mode.pageParams.curPage <= mode.pageParams.perPage + 2) {
                        mode.pageParams.curPage = 0;
                    }else{
                        mode.pageParams.curPage -= mode.pageParams.perPage;
                    }
                    break;
                }

                case '8' : {
                    mode.pageParams.curPage = searchModeItems.length;
                    break;
                }

                case '9' : {
                    mode.pageParams.curPage = 1;
                    break;
                }
                default: { console.log(`[handleMode_1_0] 알 수 없는 에러입니다. ${JSON.stringify(mode)}`); }
            }
            break;
        }

        case 1: { 
            mode.searchCondition = { name: input, site: '', number: '' };
            mode.searchModePaginate.name = input;
            mode.searchModePaginate.number = "";
            mode.searchModePaginate.site = "";
            searchModeItems.length = 0;
            console.log('이름입력 확인', mode.searchCondition.name);         
            mode.master = 1;
            mode.slave = 0;
            mode.pageParams = {...mode.pageParams};      
            break;
        }

        case 2: { 
            mode.searchCondition = { name: '', site: input, number: '' };
            mode.searchModePaginate.site = input;
            mode.searchModePaginate.name = "";
            mode.searchModePaginate.site = "";
            searchModeItems.length = 0;
            console.log('지역입력 확인', mode.searchCondition.site);
            mode.master = 1;
            mode.slave = 0;
            mode.pageParams = {...mode.pageParams};
            break;
        }

        case 3: { 
            mode.searchCondition = { name: '', site: '', number: input };
            mode.searchModePaginate.number = input;
            mode.searchModePaginate.name = "";
            mode.searchModePaginate.site = "";
            searchModeItems.length = 0;
            console.log('번호입력 확인', mode.searchCondition.number);
            mode.master = 1;
            mode.slave = 0;
            mode.pageParams = {...mode.pageParams};
            break;
        }

        default: {
            console.log(`[handleMode_1] 알 수 없는 에러입니다. ${JSON.stringify(mode)}`);
            mode.master = 1;
            mode.slave = 0;
            mode.pageParams = {...mode.pageParams};
            break;
        }
    }
}

function handleMode_2(mode: Mode, input: string) {
    
    console.log(`input ${input} on mode 2`);
    switch(mode.slave) {
        case 0: {
            mode.tempPerson.name = input;
            mode.slave++;
            break;
        }
        case 1: {
            mode.tempPerson.site = input;
            mode.slave++;
            break;
        }
        case 2: {
            mode.tempPerson.number = input;
            mode.slave++;
            break;
        }
        case 3: {
            handleMode_23(mode, input);
            break;
        }
        default: {
            console.log(`[handleMode_1] 알 수 없는 에러입니다. ${JSON.stringify(mode)}`);
            break;
        }
    }
}

function handleMode_23(mode: Mode, input: string) {

    switch(input) {
        case '1': { 
            saveList(mode.tempPerson);
            console.log(`성공적으로 저장 되었습니다.`);
            mode.tempPerson.name = '';
            mode.tempPerson.site = '';
            mode.tempPerson.number = '';
            mode.slave = 3;                 
            break;
        }

        case '2': { 
            mode.tempPerson.name = '';
            mode.tempPerson.site = '';
            mode.tempPerson.number = '';
            mode.slave = 0;
            console.log('다시 입력 확인', mode.tempPerson);
            break;
        }

        case '3': { 
            mode.tempPerson.name = '';
            mode.tempPerson.site = '';
            mode.tempPerson.number = '';
            mode.master = 0;
            mode.slave = 0;
            console.log('돌아가기 확인', mode.tempPerson);
            break;
        }

        default: { console.log(`없는 명령어 입니다.`); break; }
    }
}


function handleIdxChoice(mode:Mode, input: string) {
    // console.log(`handleIdxChoice로 mode 전달 m : ${mode.master} , s : ${mode.slave}`);
    switch(mode.slave) {

        case 0: {
            console.log(`idx : ${input} 입력 확인`);
            mode.idx = input;
            mode.slave = 1;    
            break; 
        }

        case 1: {
            itemModifySelector(mode, input);
            itemModifier(mode, input);
            break;
        }

        case 2: {
            switch(input) {
                case '1' : {
                    deleteList(mode.idx);
                    mode.master = 0;
                    mode.slave = 0;
                    mode.idxInfo.name = '';
                    mode.idxInfo.site = '';
                    mode.idxInfo.number = '';
                    mode.idx = '';
                    break;
                };

                case '2' : {
                    mode.slave = 1;
                    break;
                }
            }
            break;
        }

        default: {
            console.log(`[handleMode_1] 알 수 없는 에러입니다. ${JSON.stringify(mode)}`);
            break;
        }
    }
}

function exit() {
    console.log('프로그램을 종료합니다.');
    rl.close();
    process.exit(-1);
}



async function handleInput(mode: Mode, input: string) {
    if(input) {
        switch(mode.master) {
            case 0: { handleMode_0(mode, input); break; }
            case 1: { handleMode_1(mode, input); break; }
            case 2: { handleMode_2(mode, input); break; }
            case 3: { handleIdxChoice(mode, input); break; }
            default: { console.log('없는 명령어입니다.'); break; }
        }
    }

    // await (new Promise((r) => { setTimeout(r, 1500) }));
    // console.log(`출력 전의 값 master : ${mode.master} slave : ${mode.slave} modify : ${mode.modify}`);
    
    if(!(mode.master == 1 && mode.slave != 0) && !(mode.master == 2 && mode.slave != 0) && !(mode.master == 3 && mode.slave == 0)) {
        // console.clear();
        if(mode.master == 1) printMode_1_header(mode);
        printList(mode.pageParams.perPage, mode.searchCondition, mode.idx, mode);
    };


    switch(mode.master) {
        case 0: {
            paginationChecker(mode);
            printMode_0(mode); 
            break; }
        case 1: {
            paginationChecker(mode); 
            printMode_1(mode); 
            break; }
        case 2: { 
            printMode_2(mode); 
            break; }
        case 3: { 
            printIdxChoiceMode(mode); 
            break; }
        default: { console.log(`[rl.on] 알 수 없는 출력 오류 입니다. ${JSON.stringify(mode)}`) }
    }

}

function paginationChecker(mode:Mode) {
    if(mode.pageParams.curPage <= mode.pageParams.perPage) {
        console.log('첫 페이지입니다');
    }else if(mode.pageParams.curPage >= fullList.length) {
        console.log('마지막 페이지 입니다');
        
    }
}


initList();

let bindedHandle = handleInput.bind(null, { 
    master: 0, 
    slave: 0,
    modify: 0,
    pageParams : {
        perPage : 3,
        curPage : 0,
    },
    tempPerson : { 
        name: '', 
        site: '', 
        number: '' 
    },
    searchCondition : { 
        name: '', 
        site: '', 
        number: '' 
    },
    idxInfo : {
        name : '',
        site : '',
        number : '',
    },
    searchModePaginate : {
        name : '',
        site : '',
        number : '',
    },
    idx : '',


}); 

bindedHandle();
rl.on('line', bindedHandle);

