# 2D-Wave README

## Metadata 
- Dataset name: 2D-Wave
- Timestamp: 2026-08-10 12:33:36 BST
- Type: Physical
- Data object type: PDESymbolicSpec
- No. of data objects: 1
- Metadata: Dataset contains 1 PDE symbolic specification object. 

## User comments
- Description:	
The foundational mathematical and symbolic specification required to model the partial differential equation (PDE). The 2D wave equation is formulated as an initial value problem. This defines the physical laws and constraints that will be computed during the simulation step over time and space, accounting for each spacial dimension, to produce the dense PDE spatio-temporal field (c1). This invloves defining the governing equations (2nd-order hyperbolic PDE u_tt - c^2 (u_xx + u_yy) = 0 with c = 2), the continuous problem domain ((t,x,y) in [1]^3), and the necessary boundary/initial conditions (homogeneous Dirichlet).

- Governing equation and physical context:
2nd-order hyperbolic PDE  	:	u_tt - c^2 (u_xx + u_yy) = 0
	let c = 2  ->  u_tt - 4 (u_xx + u_yy) = 0
Domain	:	(t,x,y) in [0,100] x [0,1] x [0,1]
DomainExact solution	:	u(t,x,y) = sin(3 pi x) sin(4 pi y) cos(10 pi t)  + 0.5 sin(6 pi x) sin(8 pi y) cos(20 pi t)
Initial condition	:	u(0,x,y) = sin(3 pi x) sin(4 pi y) + 0.5 sin(6 pi x) sin(8 pi y) , u_t(0,x,y) = 0
Boundary condition	:	u = 0 on the full boundary of [0,1]^2  (homogeneous Dirichlet)


