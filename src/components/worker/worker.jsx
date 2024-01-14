import { useEffect, useState } from "react";
import { Skeleton, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import WorkerAcordeon from "../interfazMUI/workerAcordeon";

const Worker = ({ userData, userAuth }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (userData !== 1) {
      if (!userData.worker) {
        navigate("/requestDenied401");
      }
    } else if (userAuth) {
      navigate("/requestDenied401");
    } else {
      return;
    }
  }, [userData, userAuth]);

  return (
    <div>
      {userData === 1 ? (
        <Stack spacing={5}>
          <Skeleton variant="rounded" width={340} height={100} />
          <Skeleton variant="rounded" width={340} height={100} />
          <Skeleton variant="rounded" width={340} height={100} />
        </Stack>
      ) : userData.worker ? (
        <div>
          <h1>Administracion del worker</h1>
          <WorkerAcordeon user={userData} />
        </div>
      ) : null}
    </div>
  );
};

export default Worker;
