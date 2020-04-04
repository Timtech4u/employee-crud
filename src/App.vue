<template>
  <div>
    <el-popover
      placement="bottom"
      title="New Employee"
      width="200"
      trigger="click"
    >
      <el-input
        placeholder="John Doe"
        v-model="name"
        @blur="createEmployee()"
      ></el-input>
      <el-button round slot="reference" type="success"
        >Add New Employee</el-button
      >
    </el-popover>
    <el-table
      :data="
        employeesData.filter(
          (data) =>
            !search || data.name.toLowerCase().includes(search.toLowerCase())
        )
      "
      style="width: 100%;"
    >
      <el-table-column label="Date" prop="date"> </el-table-column>
      <el-table-column label="Name" prop="name"> </el-table-column>
      <el-table-column align="right">
        <template slot="header" :slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="Type to search" />
        </template>
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            title="Edit Employee"
            width="200"
            trigger="click"
          >
            <el-input
              placeholder="John Doe"
              v-model="scope.row.name"
              @blur="editEmployee(scope.$index, scope.row)"
            ></el-input>
            <el-button size="mini" slot="reference">Edit</el-button>
          </el-popover>
          <el-button
            size="mini"
            type="danger"
            @click="deleteEmployee(scope.$index, scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import firebase from "./firebaseInit";
const db = firebase.firestore();

export default {
  data() {
    return {
      name: "",
      date: new Date().toISOString().slice(0, 10),
      employeesData: [],
      search: "",
    };
  },
  methods: {
    createEmployee() {
      if (this.name != "") {
        db.collection("employees")
          .add({ date: this.date, name: this.name })
          .then(() => {
            console.log("Document successfully written!");
            this.readEmployees();
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
        this.name = "";
      }
    },
    readEmployees() {
      this.employeesData = [];
      db.collection("employees")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.employeesData.push({
              id: doc.id,
              name: doc.data().name,
              date: doc.data().date,
            });
            console.log(doc.id, " => ", doc.data());
          });
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    },
    editEmployee(index, row) {
      db.collection("employees")
        .doc(row.id)
        .update({
          name: row.name,
          date: this.date,
        })
        .then(() => {
          console.log("Document successfully updated!");
          this.readEmployees();
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    },
    deleteEmployee(index, row) {
      db.collection("employees")
        .doc(row.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          this.readEmployees();
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    },
  },
  mounted() {
    this.readEmployees();
  },
};
</script>
