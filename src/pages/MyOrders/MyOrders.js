import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { TiWarningOutline } from "react-icons/ti";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import auth from "../../firebase.init";

const MyOrders = () => {
   const [user] = useAuthState(auth);
   const [deleteOrderId, setDeleteOrderId] = useState("");
   const {
      data: myOrders,
      isLoading,
      refetch,
   } = useQuery(["myOrders", user], () =>
      fetch(`http://localhost:4000/order/?email=${user?.email}`, {
         method: "GET",
         headers: {
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
         },
      }).then((res) => res.json())
   );
   if (isLoading) {
      return <Loading></Loading>;
   }

   const handleCancelOrder = (id) => {
      console.log(id);
      fetch(`http://localhost:4000/order/${id}`, {
         method: "DELETE",
         headers: {
            "content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
         },
      })
         .then((res) => res.json())
         .then((result) => {
            if (result.deletedCount) {
               toast.success("Order cancelled successfully!");
               refetch();
               setDeleteOrderId("");
            }
            if (result.message) {
               toast.error("You don't have the authorization");
               setDeleteOrderId("");
            }
         });
   };
   return (
      <div>
         <h2 className="text-xl mb-2">Manage Products</h2>
         <div class="overflow-x-auto w-full">
            {myOrders?.length !== 0 ? (
               <table class="table w-full">
                  <thead>
                     <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Order Date</th>
                        <th>Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {myOrders?.map((order) => (
                        <tr key={order._id}>
                           <td>
                              <div class="flex items-center space-x-3">
                                 <div class="avatar">
                                    <div class="mask mask-squircle w-12 h-12">
                                       <img
                                          src={order.productImg}
                                          alt="Avatar Tailwind CSS Component"
                                       />
                                    </div>
                                 </div>
                                 <div>
                                    <div class="font-bold">{order.product}</div>
                                    <span className="text-xs text-slate-400">
                                       Order#{order._id}
                                    </span>
                                 </div>
                              </div>
                           </td>
                           <td>
                              <div className="flex items-center gap-1">
                                 {order.orderUnit} unit
                              </div>
                           </td>
                           <td>${order.orderAmount}</td>
                           <td>{order.orderDate}</td>
                           <th>
                              <div className="flex gap-2 items-center">
                                 <span className="text-sm badge bg-base-300 border-0 text-black font-thin ">
                                    {order.status}
                                 </span>
                                 <label for="payment" class=" cursor-pointer">
                                    {order.status === "unpaid" && (
                                       <Link to={`/payment/${order._id}`}>
                                          <span className="text-sm badge badge-lg border-0 text-white font-thin ">
                                             Pay
                                          </span>
                                       </Link>
                                    )}
                                 </label>
                                 {order.status === "unpaid" && (
                                    <label
                                       for="delete-order"
                                       onClick={() =>
                                          setDeleteOrderId(order._id)
                                       }
                                       className="text-sm badge badge-lg border-0 text-white font-thin badge-error cursor-pointer"
                                    >
                                       Cancel
                                    </label>
                                 )}
                              </div>
                           </th>
                        </tr>
                     ))}
                  </tbody>
                  <tfoot>
                     <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Order Date</th>
                        <th>Action</th>
                     </tr>
                  </tfoot>
               </table>
            ) : (
               `You don't have any order yet`
            )}
         </div>
         {deleteOrderId && (
            <>
               <input type="checkbox" id="delete-order" class="modal-toggle" />
               <div class="modal modal-bottom sm:modal-middle">
                  <div class="modal-box">
                     <h3 class="font-bold text-lg flex items-end ">
                        <TiWarningOutline className="text-5xl text-red-500"></TiWarningOutline>
                        Are you sure?
                     </h3>
                     <p>
                        Are you sure you want to delete this order? Order will
                        be deleted permanently.
                     </p>

                     <div class="modal-action">
                        <button
                           onClick={() => setDeleteOrderId("")}
                           class="btn text-white border-0"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={() => handleCancelOrder(deleteOrderId)}
                           class="btn bg-red-500 hover:bg-red-600 text-white border-0"
                        >
                           Delete
                        </button>
                     </div>
                  </div>
               </div>
            </>
         )}
      </div>
   );
};

export default MyOrders;
