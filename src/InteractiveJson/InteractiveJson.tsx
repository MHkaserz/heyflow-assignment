import { useEffect, useMemo, useState } from "react";
import lodash from 'lodash';
import './InteractiveJson.scss';

type InteractiveJsonProps = {
   jsonData: Record<string, any>
}

function InteractiveJson(props: InteractiveJsonProps) {
   const [selectedPath, setSelectedPath] = useState('');
   const [selectedValue, setSelectedValue] = useState('');
   const { jsonData } = props;

   useEffect(() => {
      setSelectedValue(
         JSON.stringify(lodash.get(jsonData, selectedPath), null, 3) ?? 'undefined'
      );
   }, [jsonData, selectedPath])

   const jsxElements: JSX.Element[] = useMemo(() => {
      return Object.entries(jsonData).map(([key, value]) =>
         getKeyValueJSX(0, '', key, value, setSelectedPath, setSelectedValue)
      );
   }, [jsonData, setSelectedPath, setSelectedValue]);

   return (
      <div className='interactive-json'>
         <div className="json-current-key-value">
            <div className="json-current-key-input-container">
               <label htmlFor='json-current-key-input'>Target key:</label>
               <input
                  type="text"
                  onChange={(e) => setSelectedPath(e.currentTarget.value)}
                  id='json-current-key-input'
                  value={selectedPath}
                  className='json-current-key'
               />
            </div>
            <div className="json-current-value-container">
               <span className="title">Value of target:</span>
               <pre className='json-current-value'>
                  {selectedValue}
               </pre>
            </div>
         </div>
         <div className="json-current-target-container">
            <span className="title">Target JSON:</span>
            <pre className="json-container">
               {jsxElements}
            </pre>
         </div>
      </div>
   );
}

const getKeyValueJSX = (
   level: number,
   parentKey: string,
   key: string,
   value: any,
   setSelectedPath: React.Dispatch<React.SetStateAction<string>>,
   setSelectedValue: React.Dispatch<React.SetStateAction<string>>
): JSX.Element => {
   let valueElem = <></>;
   let keyPath = parentKey.length ? `${parentKey}.${key}` : key;
   let bracket1 = '';
   let bracket2 = '';
   let levelSpacing = '2ch';

   // handle nested key
   if (parentKey.length && key.length) {
      keyPath = `${parentKey}.${key}`;
   }

   // handle inital key
   if (!parentKey.length && key.length) {
      keyPath = key;
   }

   // handle array of arrays
   if (parentKey.length && !key.length) {
      keyPath = parentKey;
   }

   if (typeof (value) !== 'object') {
      let color = value === null ? '#808080' : typeof (value) === 'boolean' ? '#0000FF' : typeof (value) === 'string' ? '#FF6600' : '#00D084';
      valueElem = (
         <span style={{ color: color }}>
            {JSON.stringify(value, null, 3)}<span style={{ color: 'white' }}>,</span>
         </span>
      );
   } else {
      if (Array.isArray(value)) {
         // handle array
         bracket1 = '[';
         bracket2 = ']';
         valueElem = (
            <>
               {
                  value.map((curArrayElem, idx) => (
                     <div
                        style={{ marginLeft: `calc(${level + 1} * ${levelSpacing})` }}
                        className='array-elem'
                        key={`${keyPath}[${idx}]`}
                     >
                        <span
                           className='json-key-selector'
                           onClick={
                              () => {
                                 setSelectedPath(`${keyPath}[${idx}]`);
                                 setSelectedValue(JSON.stringify(curArrayElem, null, 3));
                              }
                           }
                        >
                           {idx}
                        </span>
                        <>
                           {getKeyValueJSX(0, `${keyPath}[${idx}]`, '', curArrayElem, setSelectedPath, setSelectedValue)}
                        </>
                     </div>
                  ))
               }
            </>
         )
      } else {
         // handle nested json
         bracket1 = '{';
         bracket2 = '}';
         valueElem = (
            <>
               {
                  Object.entries(value).map(
                     ([key, value]) => (
                        getKeyValueJSX(level + 1, keyPath, key, value, setSelectedPath, setSelectedValue)
                     )
                  )
               }
            </>
         )
      }
   }

   let jsxElem = (
      <div
         className='json-key-value'
         key={keyPath}
      >
         <span
            style={{ marginLeft: `calc(${key.length ? level : 0} * ${levelSpacing})` }}
            className='json-key-selector'
            onClick={
               () => {
                  setSelectedPath(keyPath);
                  setSelectedValue(JSON.stringify(value, null, 3));
               }
            }
         >
            {key}
         </span>: {bracket1}
         {valueElem}
         <span style={{ marginLeft: `calc(${key.length ? level : 0} * ${levelSpacing})` }}>
            {bracket2}{bracket2.length && parentKey.length ? <span style={{ color: 'white' }}>,</span> : ''}
         </span>
      </div>
   );

   return jsxElem;
}

export default InteractiveJson;