export const changeCard = (state, { isEdit, newContent }) => {
    const { stateForRender, stateMDContent, lastSelectedElem } = state;
    let wasChanged = false;
    const newStatePreact = stateForRender.map((column) => column.map((card) => {
        if (card.isSelected) {
            card.isEdit = isEdit;
            if (newContent && (wasChanged = newContent.markdownContent !== card.markdownContent)) {
                card.headerHTML = newContent.headerHTML;
                card.contentsHTML = [...newContent.contentsHTML];
                card.markdownContent = newContent.markdownContent;
            }
        }
        return card;
    }));
    if (wasChanged) {
        let newMD = '';
        for (const { id, markdownContent } of stateMDContent) {
            if (id === lastSelectedElem.id)
                newMD += newContent.markdownContent;
            else
                newMD += markdownContent;
        }
        return { ...state, stateForRender: [...newStatePreact], stateOfNavigation: newMD };
    }
    else {
        return { ...state, stateForRender: [...newStatePreact] };
    }
};
//# sourceMappingURL=changeCard.js.map