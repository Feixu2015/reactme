/**
 * Created by biml on 2017/10/21.
 */
import React, { Component } from 'react';
import './search.css';

class ProductCategoryRow extends React.Component {
    render() {
        const category = this.props.category;
        return (
            <tr>
                <th colSpan="2">
                    {category}
                </th>
            </tr>
        );
    }
}

class ProductRow extends React.Component {
    render() {
        const product = this.props.product;
        const name = product.stocked ?
            product.name :
            <span style={{color: 'red'}}>
        {product.name}
      </span>;

        return (
            <tr>
                <td>{name}</td>
                <td>{product.price}</td>
            </tr>
        );
    }
}

class ProductTable extends React.Component {
    render() {
        const rows = [];
        let lastCategory = null;

        this.props.products.forEach((product) => {
            if(product.name.indexOf(this.props.searchText) === -1){
                return;
            }

            if(!product.stocked && this.props.isStockedOnly){
                return;
            }

            if (product.category !== lastCategory) {
                rows.push(
                    <ProductCategoryRow
                        category={product.category}
                        key={product.category} />
                );
            }
            rows.push(
                <ProductRow
                    product={product}
                    key={product.name} />
            );
            lastCategory = product.category;
        });

        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class SearchBar extends React.Component {
    constructor(props){
        super(props);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
    }

    handleTextChange(e){
        this.props.onTextChange(e.target.value);
    }

    handleCheckChange(e){
        console.log(e.target.checked);
        this.props.onCheckChange(e.target.checked);
    }

    render() {

        return (
            <form>
                <input type="text" placeholder="Search..." value={this.props.searchText}
                onChange={this.handleTextChange}/>
                <p>
                    <input type="checkbox" checked={this.props.isStockedOnly}
                    onChange={this.handleCheckChange}/>
                    {' '}
                    Only show products in stock
                </p>
            </form>
        );
    }
}

class FilterableProductTable extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchText:'',
            isStockedOnly:false
        };
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleCheckChange = this.handleCheckChange.bind(this);
    }

    handleTextChange(text){
        this.setState({
            searchText: text
        });
    }

    handleCheckChange(isChecked){
        this.setState({
            isStockedOnly: isChecked
        });
    }

    render() {
        return (
            <div>
                <SearchBar searchText={this.state.searchText} onTextChange={this.handleTextChange}
                           isStockedOnly={this.state.isStockedOnly} onCheckChange={this.handleCheckChange} />
                <ProductTable products={this.props.products} searchText={this.state.searchText}
                              isStockedOnly={this.state.isStockedOnly} />
            </div>
        );
    }
}

const PRODUCTS = [
    {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
    {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
    {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
    {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
    {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
    {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

class SearchApp extends React.Component {
    render(){
        return (
            <FilterableProductTable products={PRODUCTS}/>
        );
    }
}

export default SearchApp;
