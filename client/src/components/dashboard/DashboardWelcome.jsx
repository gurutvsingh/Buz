import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBolt,
  FaBuilding,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const DashboardWelcome = ({ business }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
      relative
      overflow-hidden
      rounded-2xl
      bg-gradient-to-r
      from-blue-600
      to-slate-900
      p-6
      text-white
      shadow-sm
    "
    >
      <div className="relative z-10">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          {/* LEFT */}

          <div>

            <div
              className="
              mb-4
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-white/10
              px-4
              py-2
              text-sm
              font-bold
            "
            >
              <FaBolt />
              BUZ Command Center
            </div>

            <h1
              className="
              max-w-3xl
              text-3xl
              font-black
              leading-tight
            "
            >
              {business
                ? business.name
                : "Create Your First Business"}
            </h1>

            <p
              className="
              mt-3
              max-w-2xl
              text-sm
              leading-6
              text-blue-100
            "
            >
              Manage income, expenses,
              billing, reminders,
              customers and daily
              operations from one smart
              business platform.
            </p>

            {/* STATS */}

            <div className="mt-5 flex flex-wrap gap-3">

              <div
                className="
                rounded-xl
                bg-white/10
                px-4
                py-3
                backdrop-blur
              "
              >
                <p className="text-xs text-slate-300">
                  Status
                </p>

                <p className="mt-1 font-black">
                  Active
                </p>
              </div>

              <div
                className="
                rounded-xl
                bg-white/10
                px-4
                py-3
                backdrop-blur
              "
              >
                <p className="text-xs text-slate-300">
                  Workspace
                </p>

                <p className="mt-1 font-black">
                  BUZ Cloud
                </p>
              </div>

              <div
                className="
                rounded-xl
                bg-white/10
                px-4
                py-3
                backdrop-blur
              "
              >
                <p className="text-xs text-slate-300">
                  Security
                </p>

                <p className="mt-1 font-black">
                  JWT Protected
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="flex flex-col gap-4">

            <Link
              to={
                business
                  ? "/income"
                  : "/businesses"
              }
              className="
              inline-flex
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-white
              px-5
              py-3
              font-bold
              text-slate-950
              transition
              hover:bg-blue-50
            "
            >
              <FaMoneyBillWave />

              {business
                ? "Add Income"
                : "Create Business"}

              <FaArrowRight />
            </Link>

            <Link
              to="/businesses"
              className="
              inline-flex
              items-center
              justify-center
              gap-3
              rounded-2xl
              border
              border-white/20
              bg-white/10
              px-5
              py-3
              font-semibold
              text-white
              backdrop-blur
              transition
              hover:bg-white/20
            "
            >
              <FaBuilding />
              Manage Businesses
            </Link>

          </div>

        </div>

      </div>

    </motion.div>
  );
};

export default DashboardWelcome;
