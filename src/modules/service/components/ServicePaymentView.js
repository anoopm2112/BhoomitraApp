import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { components, I18n, utils } from '../../../common';
import { COLLECTION_TYPE } from '../constants';

const {
    dimensionUtils: { convertHeight, convertWidth }
} = utils;
const { SafeAreaView, List, ListItem, Icon, Header } = components;

const ArrowIcon = (props) => (
    <Icon name="chevron-right" pack="material-community" {...props} />
);

class ServicePaymentView extends React.Component {

    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
    }

    _renderItem({ item }) {
        return (
            <ListItem style={styles.listRowView}
                cardView={false}
                title={item.label}
                accessoryRight={ArrowIcon}
                accessoryLeft={(props) => (
                    <Icon name={item.iconName} pack="material-community" {...props} />
                )}
                onPress={() => {
                    if (item.route) {
                        item.route();
                    }
                }} />
        );
    }

    render() {
        const { data: { customerNumber } } = this.props.route.params;
        const settingsRoutes = [
            { label: I18n.t('collection'), iconName: 'cash', route: () => this.props.navigateToPaymentCollectionList({ customerNumber, collectionTypeId: COLLECTION_TYPE.COLLECTION }) },
            { label: I18n.t('subscription'), iconName: 'cash-multiple', route: () => this.props.navigateToPaymentCollectionList({ customerNumber, collectionTypeId: COLLECTION_TYPE.SUBSCRIPTION }) }
        ];
        return (
            <>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView>
                    <Header title={I18n.t('payments_small')} />
                    <List
                        style={styles.container}
                        data={settingsRoutes}
                        renderItem={this._renderItem}
                    />
                </SafeAreaView>
            </>
        );
    }
}

const styles = StyleSheet.create({
    listRowView: {
        marginTop: convertHeight(7),
        marginHorizontal: convertWidth(7)
    }
});

export default ServicePaymentView;
