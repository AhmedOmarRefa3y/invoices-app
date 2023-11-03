import { Invoice } from "@prisma/client";
import React from "react";

interface DaisytableProps {
    inovices: {
        id: string;
        customerName: string;
        date: Date;
        number: number;
        products: {
            id: string;
            name: string;
            quantity: number;
            price: number;
        }[];
    }[];
}
const Daisytable: React.FC<DaisytableProps> = ({ inovices }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table table-xs">
                <thead>
                    <tr>
                        <th>number</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>location</th>
                        <th>Last Login</th>
                        <th>Favorite Color</th>
                    </tr>
                </thead>
                <tbody>
                    {inovices.map((Item) => {
                        let amount = 0;
                        Item.products.map((item) => {
                            amount = +item.price * item.quantity;
                        });
                        return (
                            <tr>
                                <th>{Item.number}</th>
                                <td>{Item.customerName}</td>
                                <td>{Item.date.toDateString()}</td>
                                <td>{amount}</td>
                                <td>Canada</td>
                                <td>12/16/2020</td>
                                <td>Blue</td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Job</th>
                        <th>company</th>
                        <th>location</th>
                        <th>Last Login</th>
                        <th>Favorite Color</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default Daisytable;
