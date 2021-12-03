import { jsx as _jsx } from "preact/jsx-runtime";
import _ from 'lodash';
import { useEffect } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { RootReducerActions } from '../redux/actions';
import { ListColumnsDepths } from './ListColumnsDepths';
const { createMainStates, clickCardView } = RootReducerActions;
export const App = ({ plugin }) => {
    const { columsWithCards, lastSelectedElem, stateOfNavigation } = useSelector(({ stateForRender, lastSelectedElem, stateOfNavigation }) => {
        return { columsWithCards: stateForRender, lastSelectedElem, stateOfNavigation };
    });
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(createMainStates(plugin.currentMd));
    }, [plugin.currentMd]);
    useEffect(() => {
        if (stateOfNavigation) {
            (async () => {
                await plugin.app.vault.adapter.write(plugin.filePath, stateOfNavigation);
            })();
        }
    }, [stateOfNavigation]);
    const onKeyDown = (e, selectedElem, inputState) => {
        if (_.find(columsWithCards.flat(), { isEdit: true }))
            return;
        const code = e.code;
        if (code === 'ArrowUp' || code === 'ArrowDown') {
            e.preventDefault();
            const depthIndex = selectedElem.depth - 1;
            let currentIndex = 0;
            if (depthIndex >= 0) {
                for (const elem of inputState[depthIndex]) {
                    if (elem.id === selectedElem.id) {
                        currentIndex = inputState[depthIndex].indexOf(elem);
                    }
                }
                const lastIndex = inputState[depthIndex].length - 1;
                if (code === 'ArrowUp' && currentIndex > 0)
                    currentIndex--;
                else if (code === 'ArrowDown' && currentIndex < lastIndex)
                    currentIndex++;
                const returnedItem = inputState[depthIndex][currentIndex];
                const { id, depth, children, parents, neighbors, scrollChildren } = returnedItem;
                dispatch(clickCardView({ id, depth, children, parents, neighbors, scrollChildren }));
            }
        }
        else if (code === 'ArrowLeft' || code === 'ArrowRight') {
            e.preventDefault();
            const parentOrChild = (parent, selectedId = selectedElem.id, state = inputState) => {
                for (const { id, parents, scrollChildren } of state.flat()) {
                    if (selectedId === id) {
                        return parent ? parents[parents.length - 1] : scrollChildren[0];
                    }
                }
            };
            const needElem = code === 'ArrowLeft' ? parentOrChild(true) : parentOrChild(false);
            if (needElem && inputState[needElem.depth - 1]) {
                for (const elem of inputState[needElem.depth - 1]) {
                    if (needElem.id === elem.id) {
                        const { id, depth, children, parents, neighbors, scrollChildren } = elem;
                        dispatch(clickCardView({ id, depth, children, parents, neighbors, scrollChildren }));
                    }
                }
            }
        }
    };
    return (_jsx("section", { className: "section-columns", onKeyDown: (e) => onKeyDown(e, lastSelectedElem, columsWithCards), tabIndex: 0, children: columsWithCards.map((depths, index) => {
            return depths.length ? _jsx(ListColumnsDepths, { cards: depths }, index) : null;
        }) }, void 0));
};
//# sourceMappingURL=App.js.map